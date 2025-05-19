package com.ssafy.hangbokdog.post.post.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.post.post.domain.PostLike;

public interface PostLikeJpaRepository extends JpaRepository<PostLike, Long>, PostLikeQueryRepository {
    boolean existsByPostIdAndMemberId(Long postId, Long memberId);

    void deleteByPostIdAndMemberId(Long postId, Long memberId);

    @Query("""
            SELECT pl.postId
            FROM PostLike pl
            WHERE pl.memberId = :memberId AND pl.postId IN :postIds
        """)
    List<Long> findLikedPostIdsByMemberId(Long memberId, List<Long> postIds);
}
