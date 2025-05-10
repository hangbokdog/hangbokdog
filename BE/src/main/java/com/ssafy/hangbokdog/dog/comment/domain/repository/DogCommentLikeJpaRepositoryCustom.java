package com.ssafy.hangbokdog.dog.comment.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.comment.dto.DogCommentLikeInfo;

public interface DogCommentLikeJpaRepositoryCustom {
	List<DogCommentLikeInfo> findByDogId(Long dogId);
}
