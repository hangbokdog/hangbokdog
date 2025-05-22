package com.ssafy.hangbokdog.dog.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.dog.comment.domain.DogComment;

public interface DogCommentJpaRepository extends JpaRepository<DogComment, Long>, DogCommentJpaRepositoryCustom {

	@Query("""
		SELECT COUNT(dc)
		FROM DogComment dc
		WHERE dc.dogId = :dogId
		""")
	int countByDogId(Long dogId);
}
