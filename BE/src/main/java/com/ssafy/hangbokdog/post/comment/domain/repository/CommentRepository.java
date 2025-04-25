package com.ssafy.hangbokdog.post.comment.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.post.comment.domain.Comment;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentRepository {

    private final CommentJpaRepository commentJpaRepository;

    public Comment save(Comment comment) {
        return commentJpaRepository.save(comment);
    }

    public Optional<Comment> findById(Long commentId) {
        return commentJpaRepository.findById(commentId);
    }
}
