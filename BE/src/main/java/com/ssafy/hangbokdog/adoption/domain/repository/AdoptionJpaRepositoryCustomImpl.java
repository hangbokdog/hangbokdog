package com.ssafy.hangbokdog.adoption.domain.repository;

import static com.ssafy.hangbokdog.adoption.domain.QAdoption.*;
import static com.ssafy.hangbokdog.center.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
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

	@Override
	public AdoptedDogDetailInfo getAdoptedDogDetail(Long dogId) {
		return queryFactory
			.select(Projections.constructor(
				AdoptedDogDetailInfo.class,
				dog.id,
				dog.status,
				dog.centerId,
				center.name,
				dog.name,
				dog.profileImage,
				dog.color,
				dog.rescuedDate,
				dog.weight,
				dog.description,
				dog.isStar,
				dog.gender,
				dog.isNeutered,
				dog.dogBreed,
				Expressions.numberTemplate(
					Integer.class,
					"timestampdiff(MONTH, {0}, {1})",
					dog.birth, LocalDateTime.now()
				),
				adoption.modifiedAt,
				adoption.memberId,
				member.name,
				member.profileImage
			))
			.from(adoption)
			.leftJoin(dog).on(adoption.dogId.eq(dog.id))
			.leftJoin(member).on(adoption.memberId.eq(member.id))
			.leftJoin(center).on(dog.centerId.eq(center.id))
			.where(dog.id.eq(dogId))
			.fetchOne();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return adoption.id.lt(Long.parseLong(pageToken));
	}
}
