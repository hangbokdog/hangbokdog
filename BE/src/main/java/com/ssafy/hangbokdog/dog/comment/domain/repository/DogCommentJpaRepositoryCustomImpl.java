package com.ssafy.hangbokdog.dog.comment.domain.repository;

import static com.ssafy.hangbokdog.dog.comment.domain.QDogComment.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogCommentJpaRepositoryCustomImpl implements DogCommentJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<DogCommentResponse> findAllByDogId(Long dogId, Long loginId) {
		return queryFactory
			.select(Projections.constructor(
				DogCommentResponse.class,
				Projections.constructor(
					MemberInfo.class,
					member.id,
					member.nickName,
					member.grade.stringValue(),
					member.profileImage
				),
				dogComment.authorId.eq(loginId),
				dogComment.id,
				dogComment.parentId,
				dogComment.content,
				dogComment.isDeleted,
				dogComment.createdAt
			))
			.from(dogComment)
			.leftJoin(member).on(member.id.eq(dogComment.authorId))
			.where(dogComment.dogId.eq(dogId))
			.orderBy(dogComment.createdAt.asc())
			.fetch();
	}

	@Override
	public DogCommentResponse findByDogCommentId(Long dogCommentId, Long loginId) {
		return queryFactory
			.select(Projections.constructor(
				DogCommentResponse.class,
				Projections.constructor(
					MemberInfo.class,
					member.id,
					member.nickName,
					member.grade.stringValue(),
					member.profileImage
				),
				dogComment.authorId.eq(loginId),
				dogComment.id,
				dogComment.parentId,
				dogComment.content,
				dogComment.isDeleted,
				dogComment.createdAt
			))
			.from(dogComment)
			.leftJoin(member).on(member.id.eq(dogComment.authorId))
			.where(dogComment.id.eq(dogCommentId))
			.fetchOne();
	}
}
