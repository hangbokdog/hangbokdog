package com.ssafy.hangbokdog.adoption.domain.repository;

import static com.ssafy.hangbokdog.adoption.domain.QAdoption.*;
import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;
import static com.ssafy.hangbokdog.vaccination.domain.QVaccination.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdoptionJpaRepositoryCustomImpl implements AdoptionJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(
		Long centerId,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
				AdoptionApplicationResponse.class,
				adoption.id,
				adoption.dogId,
				dog.name,
				dog.profileImage,
				adoption.memberId,
				member.name,
				adoption.createdAt
			))
			.from(adoption)
			.leftJoin(dog).on(adoption.dogId.eq(dog.id))
			.leftJoin(member).on(adoption.memberId.eq(member.id))
			.where(dog.centerId.eq(centerId),
				adoption.status.eq(AdoptionStatus.APPLIED))
			.orderBy(adoption.id.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return adoption.id.lt(Long.parseLong(pageToken));
	}
}
