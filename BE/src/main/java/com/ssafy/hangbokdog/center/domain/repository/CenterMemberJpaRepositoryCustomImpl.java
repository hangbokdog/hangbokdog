package com.ssafy.hangbokdog.center.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.center.domain.QCenterMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.dto.response.CenterNameResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterMemberJpaRepositoryCustomImpl implements CenterMemberJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CenterNameResponse> getMyCenters(Long memberId) {
		return queryFactory
			.select(Projections.constructor(
				CenterNameResponse.class,
				center.name,
				centerMember.grade,
				centerMember.createdAt
			))
			.from(centerMember)
			.leftJoin(center)
			.on(centerMember.centerId.eq(center.id))
			.where(centerMember.memberId.eq(memberId))
			.fetch();
	}
}
