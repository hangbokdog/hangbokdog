package com.ssafy.hangbokdog.post.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.post.domain.Comment;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentRepository {

    private final CommentJpaRepository commentJpaRepository;

    public Comment save(Comment comment) {
        return commentJpaRepository.save(comment);
    }
}
