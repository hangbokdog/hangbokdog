package com.ssafy.hangbokdog.dog.comment.application;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.comment.domain.DogComment;
import com.ssafy.hangbokdog.dog.comment.domain.repository.DogCommentRepository;
import com.ssafy.hangbokdog.dog.comment.dto.DogCommentInfo;
import com.ssafy.hangbokdog.dog.comment.dto.DogCommentLikeInfo;
import com.ssafy.hangbokdog.dog.comment.dto.request.DogCommentCreateRequest;
import com.ssafy.hangbokdog.dog.comment.dto.request.DogCommentUpdateRequest;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentResponse;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentWithRepliesResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DogCommentService {

	private final DogCommentRepository dogCommentRepository;

	public Long save(
		Member member,
		Long dogId,
		DogCommentCreateRequest request
	) {
		DogComment dogComment = DogComment.builder()
			.authorId(member.getId())
			.dogId(dogId)
			.parentId(request.parentId())
			.content(request.content())
			.build();

		return dogCommentRepository.save(dogComment).getId();
	}

	public List<DogCommentWithRepliesResponse> findAllByDogId(Long dogId, Long memberId) {
		List<DogCommentInfo> flat = dogCommentRepository.findAllByDogId(dogId, memberId);
		List<Long> dogCommentIds = flat.stream()
				.map(DogCommentInfo::id)
				.collect(Collectors.toList());

		Map<Long, Integer> dogCommentLikes = dogCommentRepository.findDogCommentLikeByDogId(dogId).stream()
				.collect(Collectors.toMap(
						DogCommentLikeInfo::dogCommentId,
						DogCommentLikeInfo::count
				));

		List<Long> dogCommentLikeIds = dogCommentRepository.dogCommentLikeIdsByMemberId(memberId);

		List<DogCommentResponse> newFlat = new ArrayList<>();

		for (DogCommentInfo dogCommentInfo : flat) {
			boolean isLiked = false;

			if (dogCommentLikeIds.contains(dogCommentInfo.id())) {
				isLiked = true;
			}

			DogCommentResponse response = new DogCommentResponse(
					dogCommentInfo.author(),
					dogCommentInfo.isAuthor(),
					dogCommentInfo.id(),
					dogCommentInfo.parentId(),
					dogCommentInfo.content(),
					dogCommentInfo.isDeleted(),
					dogCommentInfo.createdAt(),
					isLiked,
					dogCommentLikes.getOrDefault(dogCommentInfo.id(), 0)
			);

			newFlat.add(response);
		}

		Map<Long, List<DogCommentResponse>> byParent = newFlat.stream()
			.filter(cr -> cr.parentId() != null)
			.collect(Collectors.groupingBy(DogCommentResponse::parentId));

		return newFlat.stream()
			.filter(cr -> cr.parentId() == null)
			.map(root -> buildTree(root, byParent))
			.collect(Collectors.toList());
	}

	public DogCommentResponse findById(Long dogCommentId, Long memberId) {
		return dogCommentRepository.findByDogCommentId(dogCommentId, memberId);
	}


	@Transactional
	public void update(
		Member member,
		Long dogCommentId,
		DogCommentUpdateRequest request
	) {
		DogComment dogComment = dogCommentRepository.findById(dogCommentId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

		if (!dogComment.isAuthor(member)) {
			throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
		}

		dogComment.update(request.content());
	}

	@Transactional
	public void delete(Member member, Long commentId) {
		DogComment dogComment = dogCommentRepository.findById(commentId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

		if (!dogComment.isAuthor(member) && !member.isManager()) {
			throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
		}

		if (dogComment.isDeleted()) {
			throw new BadRequestException(ErrorCode.COMMENT_ALREADY_DELETED);
		}

		dogComment.delete();
	}

	private DogCommentWithRepliesResponse buildTree(
		DogCommentResponse dto,
		Map<Long, List<DogCommentResponse>> byParent
	) {
		List<DogCommentWithRepliesResponse> replies = byParent.getOrDefault(dto.id(), Collections.emptyList()).stream()
			.map(child -> buildTree(child, byParent))
			.collect(Collectors.toList());

		return new DogCommentWithRepliesResponse(dto, replies);
	}
}
