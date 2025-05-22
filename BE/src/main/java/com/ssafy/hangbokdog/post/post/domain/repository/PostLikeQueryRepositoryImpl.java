package com.ssafy.hangbokdog.post.post.domain.repository;

import static com.ssafy.hangbokdog.post.post.domain.QPostLike.postLike;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.post.post.dto.PostLikeCount;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PostLikeQueryRepositoryImpl implements PostLikeQueryRepository {

	private final JPAQueryFactory queryFactory;


	@Override
	public List<PostLikeCount> findPostLikeCountIn(List<Long> postIds) {
		return queryFactory
				.select(Projections.constructor(
						PostLikeCount.class,
						postLike.postId,
						postLike.id.count().intValue()
				))
				.from(postLike)
				.where(postLike.postId.in(postIds))
				.groupBy(postLike.postId)
				.fetch();
	}
}
