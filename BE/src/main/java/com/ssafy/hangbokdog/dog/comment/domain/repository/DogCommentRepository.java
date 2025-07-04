package com.ssafy.hangbokdog.dog.comment.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.comment.domain.DogComment;
import com.ssafy.hangbokdog.dog.comment.dto.DogCommentInfo;
import com.ssafy.hangbokdog.dog.comment.dto.DogCommentLikeInfo;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogCommentRepository {
	private final DogCommentJpaRepository dogCommentJpaRepository;
	private final DogCommentLikeJpaRepository dogCommentLikeJpaRepository;

	public DogComment save(DogComment dogComment) {
		return dogCommentJpaRepository.save(dogComment);
	}

	public Optional<DogComment> findById(Long dogCommentId) {
		return dogCommentJpaRepository.findById(dogCommentId);
	}

	public DogCommentResponse findByDogCommentId(Long dogCommentId, Long loginId) {
		return dogCommentJpaRepository.findByDogCommentId(dogCommentId, loginId);
	}

	public List<DogCommentInfo> findAllByDogId(Long dogId, Long loginId) {
		return dogCommentJpaRepository.findAllByDogId(dogId, loginId);
	}

	public int countByDogId(Long dogId) {
		return dogCommentJpaRepository.countByDogId(dogId);
	}

	public boolean existsByDogCommentId(Long dogCommentId) {
		return dogCommentJpaRepository.existsById(dogCommentId);
	}

	public List<DogCommentLikeInfo> findDogCommentLikeByDogId(Long dogId) {
		return dogCommentLikeJpaRepository.findByDogId(dogId);
	}

	public List<Long> dogCommentLikeIdsByMemberId(Long memberId) {
		return dogCommentLikeJpaRepository.findByMemberId(memberId);
	}
}
