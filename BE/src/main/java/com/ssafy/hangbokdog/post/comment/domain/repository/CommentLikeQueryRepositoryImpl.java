package com.ssafy.hangbokdog.post.comment.domain.repository;

import static com.ssafy.hangbokdog.post.comment.domain.QComment.*;
import static com.ssafy.hangbokdog.post.comment.domain.QCommentLike.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.post.comment.dto.CommentLikeInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentLikeQueryRepositoryImpl implements CommentLikeQueryRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CommentLikeInfo> findCommentLikeByPostId(Long postId) {
		return queryFactory
			.select(Projections.constructor(
				CommentLikeInfo.class,
				commentLike.commentId,
				commentLike.commentId.count().intValue()
			))
			.from(commentLike)
			.join(comment).on(comment.id.eq(commentLike.commentId))
			.where(comment.postId.eq(postId))
			.groupBy(commentLike.commentId)
			.fetch();
	}
}
