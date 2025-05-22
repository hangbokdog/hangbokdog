package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import static com.ssafy.hangbokdog.emergency.application.domain.QEmergencyApplication.*;
import static com.ssafy.hangbokdog.emergency.emergency.domain.QEmergency.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPQLQueryFactory;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyStatus;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.ApprovedCount;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyJpaRepositoryCustomImpl implements EmergencyJpaRepositoryCustom {

	private final JPQLQueryFactory queryFactory;

	@Override
	public List<EmergencyInfo> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now) {
		return queryFactory
				.select(Projections.constructor(
						EmergencyInfo.class,
						emergency.id,
						emergency.centerId,
						emergency.authorId,
						member.nickName,
						emergency.title,
						emergency.content,
						member.profileImage,
						emergency.dueDate,
						emergency.capacity,
						emergency.emergencyType,
						emergency.status
				))
				.from(emergency)
				.leftJoin(member).on(emergency.authorId.eq(member.id))
				.where(
						emergency.centerId.eq(centerId),
						emergency.status.ne(EmergencyStatus.RECRUITED),
						emergency.status.ne(EmergencyStatus.COMPLETED),
						emergency.dueDate.goe(now),
						isEmergencyType(type)
				)
				.orderBy(emergency.dueDate.asc())
				.fetch();
	}

	@Override
	public List<EmergencyInfo> getLatestEmergenciesByCenterId(
			Long centerId,
			EmergencyType type,
			LocalDateTime now
	) {
		return queryFactory.select(Projections.constructor(
						EmergencyInfo.class,
						emergency.id,
						emergency.centerId,
						emergency.authorId,
						member.nickName,
						emergency.title,
						emergency.content,
						member.profileImage,
						emergency.dueDate,
						emergency.capacity,
						emergency.emergencyType,
				emergency.status
				))
				.from(emergency)
				.leftJoin(member).on(emergency.authorId.eq(member.id))
				.where(
						emergency.centerId.eq(centerId),
						emergency.status.ne(EmergencyStatus.RECRUITED),
						emergency.status.ne(EmergencyStatus.COMPLETED),
						emergency.dueDate.goe(now),
						isEmergencyType(type)
				)
				.orderBy(emergency.dueDate.asc())
				.limit(5)
				.fetch();
	}

	@Override
	public Integer countEmergenciesByEmergencyType(EmergencyType emergencyType, Long centerId) {
		return queryFactory
				.select(emergency.id.count().intValue())
				.from(emergency)
				.where(
						emergency.centerId.eq(centerId),
						emergency.emergencyType.eq(emergencyType),
						emergency.status.ne(EmergencyStatus.RECRUITED),
						emergency.status.ne(EmergencyStatus.COMPLETED),
						emergency.dueDate.goe(LocalDateTime.now())
				)
				.fetchOne();
	}

	@Override
	public List<EmergencyInfo> getRecruitedEmergencies(Long centerId) {
		LocalDateTime now = LocalDateTime.now();
		return queryFactory
				.select(Projections.constructor(
						EmergencyInfo.class,
						emergency.id,
						emergency.centerId,
						emergency.authorId,
						member.nickName,
						emergency.title,
						emergency.content,
						member.profileImage,
						emergency.dueDate,
						emergency.capacity,
						emergency.emergencyType,
						emergency.status
				))
				.from(emergency)
				.leftJoin(member).on(emergency.authorId.eq(member.id))
				.where(
						emergency.centerId.eq(centerId),
						emergency.status.ne(EmergencyStatus.RECRUITED),
						emergency.dueDate.goe(now)
				)
				.orderBy(emergency.dueDate.asc())
				.fetch();
	}

	@Override
	public List<ApprovedCount> getApprovedCountIn(List<Long> emergencyIds) {
		return queryFactory
			.select(Projections.constructor(
				ApprovedCount.class,
				emergencyApplication.emergencyId,
				emergencyApplication.id.count().intValue()
			))
			.from(emergencyApplication)
			.where(emergencyApplication.emergencyId.in(emergencyIds),
				emergencyApplication.status.eq(EmergencyApplicationStatus.APPROVED))
			.groupBy(emergencyApplication.emergencyId)
			.fetch();
	}

	private BooleanExpression isEmergencyType(EmergencyType type) {
		return (type == null) ? null : emergency.emergencyType.eq(type);
	}
}
