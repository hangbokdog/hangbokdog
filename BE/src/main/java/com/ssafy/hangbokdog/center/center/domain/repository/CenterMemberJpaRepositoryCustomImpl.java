package com.ssafy.hangbokdog.center.center.domain.repository;

import static com.ssafy.hangbokdog.center.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.center.center.domain.QCenterMember.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;

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
	public int getTotalMemberCountInCenter(Long centerId) {
		return queryFactory.select(
				centerMember.count().intValue().coalesce(0)
		).from(centerMember)
				.where(centerMember.centerId.eq(centerId))
				.fetchOne();
	}

	@Override
	public int getCenterMemberCountAfterTime(Long centerId, LocalDateTime monthAgo) {
		return queryFactory.select(
				centerMember.count().intValue().coalesce(0)
		).from(centerMember)
				.where(centerMember.centerId.eq(centerId).and(
						centerMember.createdAt.after(monthAgo))
				)
				.fetchOne();
	}

	@Override
	public int getMemberCountByCenterIdAndGrade(Long centerId, CenterGrade centerGrade) {
		return queryFactory.select(
				centerMember.count().intValue().coalesce(0))
				.from(centerMember)
				.where(centerMember.centerId.eq(centerId).and(
						centerMember.grade.eq(centerGrade))
				)
				.fetchOne();
	}
}
