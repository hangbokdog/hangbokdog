package com.ssafy.hangbokdog.dog.comment.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentResponse;

public interface DogCommentJpaRepositoryCustom {
	List<DogCommentResponse> findAllByDogId(Long dogId, Long loginId);

	DogCommentResponse findByDogCommentId(Long dogCommentId, Long loginId);
}
