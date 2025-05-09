package com.ssafy.hangbokdog.dog.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.dog.comment.domain.DogComment;

public interface DogCommentJpaRepository extends JpaRepository<DogComment, Long>, DogCommentJpaRepositoryCustom {
}
