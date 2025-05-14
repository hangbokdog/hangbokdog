package com.ssafy.hangbokdog.vaccination.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.*;
import static com.ssafy.hangbokdog.vaccination.domain.QVaccination.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationDetailInfo;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationSummaryInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VaccinationJpaRepositoryCustomImpl implements VaccinationJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public VaccinationDetailInfo getVaccinationDetail(Long vaccinationId) {
		return queryFactory
			.select(Projections.constructor(
				VaccinationDetailInfo.class,
				vaccination.id,
				vaccination.title,
				vaccination.content,
				vaccination.operatedDate,
				vaccination.authorId,
				member.nickName,
				member.profileImage,
				vaccination.status
			))
			.from(vaccination)
			.leftJoin(member).on(vaccination.authorId.eq(member.id))
			.where(vaccination.id.eq(vaccinationId))
			.fetchOne();
	}

	@Override
	public List<VaccinationSummaryInfo> getVaccinationSummariesByCenterId(
		Long centerId,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
				VaccinationSummaryInfo.class,
				vaccination.id,
				vaccination.title,
				vaccination.content,
				vaccination.operatedDate,
				vaccination.locationIds,
				vaccination.status
			))
			.from(vaccination)
			.where(vaccination.centerId.eq(centerId),
				isInRange(pageToken))
			.orderBy(vaccination.id.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return vaccination.id.lt(Long.parseLong(pageToken));
	}
}
