package com.ssafy.hangbokdog.post.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.domain.Comment;

public interface CommentJpaRepository extends JpaRepository<Comment, Long> {
}
