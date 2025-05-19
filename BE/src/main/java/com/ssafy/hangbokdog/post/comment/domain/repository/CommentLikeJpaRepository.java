package com.ssafy.hangbokdog.post.comment.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.post.comment.domain.CommentLike;

public interface CommentLikeJpaRepository extends JpaRepository<CommentLike, Long>, CommentLikeQueryRepository {

    boolean existsByCommentIdAndMemberId(Long commentId, Long memberId);

    void deleteByCommentIdAndMemberId(Long commentId, Long memberId);

    @Query("""
			SELECT cl.commentId
			FROM CommentLike cl
			WHERE cl.memberId = :memberId
			""")
    List<Long> findByMemberId(Long memberId);
}