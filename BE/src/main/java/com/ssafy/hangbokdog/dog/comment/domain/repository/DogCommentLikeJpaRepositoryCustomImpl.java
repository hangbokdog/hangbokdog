package com.ssafy.hangbokdog.dog.comment.domain.repository;

import static com.ssafy.hangbokdog.dog.comment.domain.QDogComment.dogComment;
import static com.ssafy.hangbokdog.dog.comment.domain.QDogCommentLike.dogCommentLike;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.comment.dto.DogCommentLikeInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogCommentLikeJpaRepositoryCustomImpl implements DogCommentLikeJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;


	@Override
	public List<DogCommentLikeInfo> findByDogId(Long dogId) {
		return queryFactory
				.select(Projections.constructor(
						DogCommentLikeInfo.class,
						dogCommentLike.commentId,
						dogCommentLike.commentId.count().intValue()
				))
				.from(dogCommentLike)
				.leftJoin(dogComment).on(dogComment.dogId.eq(dogId))
				.groupBy(dogCommentLike.commentId)
				.fetch();
	}
}
