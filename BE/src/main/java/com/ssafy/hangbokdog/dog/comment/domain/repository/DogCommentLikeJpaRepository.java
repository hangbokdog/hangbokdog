package com.ssafy.hangbokdog.dog.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.dog.comment.domain.DogCommentLike;

public interface DogCommentLikeJpaRepository extends JpaRepository<DogCommentLike, Long> {
}
