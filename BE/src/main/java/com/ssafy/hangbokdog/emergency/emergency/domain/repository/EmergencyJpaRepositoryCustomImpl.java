package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import static com.ssafy.hangbokdog.emergency.domain.QEmergency.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPQLQueryFactory;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyJpaRepositoryCustomImpl implements EmergencyJpaRepositoryCustom {

	private final JPQLQueryFactory queryFactory;

	@Override
	public List<EmergencyResponse> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now) {
		return queryFactory
			.select(Projections.constructor(
				EmergencyResponse.class,
				emergency.id,
				emergency.centerId,
				emergency.authorId,
				member.nickName,
				emergency.title,
				emergency.content,
				member.profileImage,
				emergency.dueDate,
				emergency.capacity,
				emergency.targetAmount,
				emergency.emergencyType
			))
			.from(emergency)
			.leftJoin(member).on(emergency.authorId.eq(member.id))
			.where(
				emergency.centerId.eq(centerId),
				emergency.dueDate.goe(now),
				isEmergencyType(type)
			)
			.fetch();
	}

	private BooleanExpression isEmergencyType(EmergencyType type) {
		return (type == null) ? null : emergency.emergencyType.eq(type);
	}
}
