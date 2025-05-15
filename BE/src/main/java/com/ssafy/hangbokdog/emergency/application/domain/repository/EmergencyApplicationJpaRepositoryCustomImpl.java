package com.ssafy.hangbokdog.emergency.application.domain.repository;

import static com.ssafy.hangbokdog.emergency.application.domain.QEmergencyApplication.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyApplicationJpaRepositoryCustomImpl implements EmergencyApplicationJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyId(Long emergencyId) {
		return queryFactory
			.select(Projections.constructor(
				EmergencyApplicationResponse.class,
				emergencyApplication.id,
				member.id,
				member.name,
				member.profileImage,
				member.phone,
				emergencyApplication.createdAt,
				emergencyApplication.status
			))
			.from(emergencyApplication)
			.leftJoin(member).on(emergencyApplication.applicantId.eq(member.id))
			.where(emergencyApplication.emergencyId.eq(emergencyId),
				emergencyApplication.status.eq(EmergencyApplicationStatus.APPLIED))
			.fetch();
	}

	@Override
	public List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(
		Long memberId,
		Long emergencyId
	) {
		return queryFactory
			.select(Projections.constructor(
				EmergencyApplicationResponse.class,
				emergencyApplication.id,
				member.id,
				member.name,
				member.profileImage,
				member.phone,
				emergencyApplication.createdAt,
				emergencyApplication.status
			))
			.from(emergencyApplication)
			.leftJoin(member).on(emergencyApplication.applicantId.eq(member.id))
			.where(emergencyApplication.emergencyId.eq(emergencyId),
				emergencyApplication.applicantId.eq(memberId))
			.fetch();
	}
}
