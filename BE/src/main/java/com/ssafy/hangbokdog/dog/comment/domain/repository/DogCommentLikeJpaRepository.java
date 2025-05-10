package com.ssafy.hangbokdog.dog.comment.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.dog.comment.domain.DogCommentLike;

public interface DogCommentLikeJpaRepository extends JpaRepository<DogCommentLike, Long>,
		DogCommentLikeJpaRepositoryCustom {

	@Query("""
		SELECT COUNT(dcl) > 0
		FROM DogCommentLike dcl
		WHERE dcl.commentId = :dogCommentId AND dcl.memberId = :memberId
		""")
	boolean existsByDogCommentIdAndMemberId(Long dogCommentId, Long memberId);

	@Modifying
	@Transactional
	@Query("""
		DELETE FROM DogCommentLike dcl
		WHERE dcl.commentId = :dogCommentId AND dcl.memberId = :memberId
		""")
	void deleteByDogCommentIdAndMemberId(@Param("dogCommentId") Long dogCommentId, @Param("memberId") Long memberId);

	@Query("""
			SELECT dcl.commentId
			FROM DogCommentLike dcl
			WHERE dcl.memberId = :memberId
			""")
	List<Long> findByMemberId(Long memberId);
}
