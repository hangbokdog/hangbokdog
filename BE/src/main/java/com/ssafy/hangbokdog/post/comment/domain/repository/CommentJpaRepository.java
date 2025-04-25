package com.ssafy.hangbokdog.post.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.comment.domain.Comment;

public interface CommentJpaRepository extends JpaRepository<Comment, Long> {
}
