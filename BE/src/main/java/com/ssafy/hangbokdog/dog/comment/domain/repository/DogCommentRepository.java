package com.ssafy.hangbokdog.dog.comment.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.comment.domain.DogComment;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogCommentRepository {
	private final DogCommentJpaRepository dogCommentJpaRepository;

	public DogComment save(DogComment dogComment) {
		return dogCommentJpaRepository.save(dogComment);
	}

	public Optional<DogComment> findById(Long dogCommentId) {
		return dogCommentJpaRepository.findById(dogCommentId);
	}

	public DogCommentResponse findByDogCommentId(Long dogCommentId, Long loginId) {
		return dogCommentJpaRepository.findByDogCommentId(dogCommentId, loginId);
	}

	public List<DogCommentResponse> findAllByDogId(Long dogId, Long loginId) {
		return dogCommentJpaRepository.findAllByDogId(dogId, loginId);
	}

	public int countByDogId(Long dogId) {
		return dogCommentJpaRepository.countByDogId(dogId);
	}

	public boolean existsByDogCommentId(Long dogCommentId) {
		return dogCommentJpaRepository.existsById(dogCommentId);
	}
}
