package com.ssafy.hangbokdog.emergency.application.domain.repository;

import static com.ssafy.hangbokdog.emergency.application.domain.QEmergencyApplication.*;
import static com.ssafy.hangbokdog.emergency.emergency.domain.QEmergency.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.dto.response.AllEmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.AppliedEmergencies;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyApplicant;

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
	public List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(Long memberId) {
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
			.where(emergencyApplication.applicantId.eq(memberId))
			.fetch();
	}

	@Override
	public List<AppliedEmergencies> getEmergencyApplicationsByMemberId(Long memberId) {
		return queryFactory
			.select(Projections.constructor(
				AppliedEmergencies.class,
				emergencyApplication.emergencyId,
				emergencyApplication.status
			))
			.from(emergencyApplication)
			.where(emergencyApplication.applicantId.eq(memberId),
				emergencyApplication.status.eq(EmergencyApplicationStatus.APPLIED))
			.fetch();
	}

	@Override
	public List<AllEmergencyApplicationResponse> getEmergencyApplicationsByCenterId(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				AllEmergencyApplicationResponse.class,
				emergency.id,
				emergency.title,
				emergencyApplication.id,
				emergencyApplication.applicantId,
				member.name,
				member.profileImage,
				member.phone,
				emergencyApplication.createdAt,
				emergencyApplication.status
			))
			.from(emergencyApplication)
			.leftJoin(emergency).on(emergencyApplication.emergencyId.eq(emergency.id))
			.leftJoin(member).on(emergencyApplication.applicantId.eq(member.id))
			.where(
				emergency.centerId.eq(centerId),
				emergency.dueDate.goe(LocalDateTime.now())
			)
			.orderBy(emergency.dueDate.asc())
			.fetch();
	}

	@Override
	public Boolean existsByMemberIdAndEmergencyId(Long memberId, Long emergencyId) {
		return queryFactory
			.selectOne()
			.from(emergencyApplication)
			.where(
				emergencyApplication.applicantId.eq(memberId),
				emergencyApplication.emergencyId.eq(emergencyId)
			)
			.fetchFirst() != null;
	}

	@Override
	public List<EmergencyApplicant> getEmergencyApplicantsByIn(List<Long> emergencyIds) {
		return queryFactory
				.select(Projections.constructor(
						EmergencyApplicant.class,
						emergencyApplication.applicantId,
						member.name,
						member.nickName,
						member.phone,
						emergencyApplication.emergencyId,
					member.profileImage
				))
				.from(emergencyApplication)
				.leftJoin(member).on(emergencyApplication.applicantId.eq(member.id))
				.leftJoin(emergency).on(emergencyApplication.emergencyId.eq(emergency.id))
				.where(emergencyApplication.emergencyId.in(emergencyIds),
						emergencyApplication.status.eq(EmergencyApplicationStatus.APPROVED))
				.fetch();

	}
}
