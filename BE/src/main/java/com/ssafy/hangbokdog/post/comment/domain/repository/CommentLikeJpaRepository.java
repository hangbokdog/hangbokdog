package com.ssafy.hangbokdog.post.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.comment.domain.CommentLike;

public interface CommentLikeJpaRepository extends JpaRepository<CommentLike, Long> {

    boolean existsByCommentIdAndMemberId(Long commentId, Long memberId);

    void deleteByCommentIdAndMemberId(Long commentId, Long memberId);
}