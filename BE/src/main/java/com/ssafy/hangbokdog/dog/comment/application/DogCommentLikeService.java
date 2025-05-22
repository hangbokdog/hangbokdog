package com.ssafy.hangbokdog.dog.comment.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.comment.domain.DogCommentLike;
import com.ssafy.hangbokdog.dog.comment.domain.repository.DogCommentLikeJpaRepository;
import com.ssafy.hangbokdog.dog.comment.domain.repository.DogCommentRepository;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DogCommentLikeService {

	private final DogCommentRepository dogCommentRepository;
	private final DogCommentLikeJpaRepository dogCommentLikeJpaRepository;

	public void toggleLike(Long dogCommentId, Member member) {
		if (!dogCommentRepository.existsByDogCommentId(dogCommentId)) {
			throw new BadRequestException(ErrorCode.COMMENT_NOT_FOUND);
		}

		if (!dogCommentLikeJpaRepository.existsByDogCommentIdAndMemberId(dogCommentId, member.getId())) {
			DogCommentLike dogCommentLike = DogCommentLike.builder()
				.commentId(dogCommentId)
				.memberId(member.getId())
				.build();
			dogCommentLikeJpaRepository.save(dogCommentLike);
		} else {
			dogCommentLikeJpaRepository.deleteByDogCommentIdAndMemberId(dogCommentId, member.getId());
		}
	}
}
