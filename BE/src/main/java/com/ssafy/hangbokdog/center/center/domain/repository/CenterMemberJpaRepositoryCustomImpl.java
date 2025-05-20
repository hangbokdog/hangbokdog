package com.ssafy.hangbokdog.center.center.domain.repository;

import static com.ssafy.hangbokdog.center.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.center.center.domain.QCenterMember.*;
import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterMemberJpaRepositoryCustomImpl implements CenterMemberJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<MyCenterResponse> getMyCenters(Long memberId) {
		return queryFactory
			.select(Projections.constructor(
				MyCenterResponse.class,
				center.id,
				center.name,
				centerMember.grade,
				center.centerCity,
				centerMember.createdAt
			))
			.from(centerMember)
			.leftJoin(center)
			.on(centerMember.centerId.eq(center.id))
			.where(centerMember.memberId.eq(memberId))
			.fetch();
	}

	@Override
	public List<CenterSearchInfo> searchCentersByName(String name) {
		return queryFactory
				.select(Projections.constructor(
						CenterSearchInfo.class,
						center.id,
						center.name
				))
				.from(center)
				.where(center.name.contains(name))
				.fetch();

	}

	@Override
	public Boolean existsMainCenter(Long memberId) {
		return queryFactory
			.selectOne()
			.from(centerMember)
			.where(centerMember.memberId.eq(memberId),
				centerMember.main.isTrue())
			.limit(1)
			.fetchFirst() != null;
	}

	@Override
	public MainCenterResponse getMainCenter(Long memberId) {
		return queryFactory
				.select(Projections.constructor(
						MainCenterResponse.class,
						center.id,
						center.name,
						centerMember.grade
				))
				.from(centerMember)
				.leftJoin(center).on(centerMember.centerId.eq(center.id))
				.where(centerMember.memberId.eq(memberId),
						centerMember.main.isTrue())
				.fetchOne();
	}

	@Override
	public List<CenterMemberResponse> getCenterMembers(
		Long centerId,
		String keyword,
		CenterGrade grade,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
				CenterMemberResponse.class,
				centerMember.id,
				centerMember.memberId,
				member.name,
				member.nickName,
				member.profileImage,
				centerMember.createdAt,
				centerMember.grade
			))
			.from(centerMember)
			.leftJoin(member).on(centerMember.memberId.eq(member.id))
			.where(
				centerMember.centerId.eq(centerId),
				hasGrade(grade),
				isInRange(pageToken),
				hasKeyword(keyword)
			)
			.orderBy(centerMember.id.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return member.id.lt(Long.parseLong(pageToken));
	}

	private BooleanExpression hasKeyword(String keyword) {
		if (keyword == null || keyword.isBlank()) return null;
		return member.name.containsIgnoreCase(keyword)
			.or(member.nickName.containsIgnoreCase(keyword));
	}

	private BooleanExpression hasGrade(CenterGrade grade) {
		return (grade == null) ? null : centerMember.grade.eq(grade);
	}

}
