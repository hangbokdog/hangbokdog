package com.ssafy.hangbokdog.foster.domain.repository;

import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.foster.domain.QFoster.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationByDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosteredDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FosterJpaRepositoryCustomImpl implements FosterJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<MyFosterResponse> findMyFosters(Long memberId) {
		return queryFactory.select(
			Projections.constructor(
				MyFosterResponse.class,
				dog.id,
				dog.name,
				dog.profileImage,
				foster.startDate,
				foster.status
			))
			.from(foster)
			.leftJoin(dog)
			.on(dog.id.eq(foster.dogId))
			.where(foster.memberId.eq(memberId)
				.and(foster.status.eq(FosterStatus.FOSTERING)))
			.fetch();
	}

	@Override
	public List<MyFosterResponse> findMyFosterApplications(Long memberId) {
		return queryFactory.select(
				Projections.constructor(
					MyFosterResponse.class,
					dog.id,
					dog.name,
					dog.profileImage,
					foster.startDate,
					foster.status
				))
			.from(foster)
			.leftJoin(dog)
			.on(dog.id.eq(foster.dogId))
			.where(foster.memberId.eq(memberId)
				.and(foster.status.eq(FosterStatus.APPLYING))
				.or(foster.status.eq(FosterStatus.ACCEPTED)))
			.fetch();
	}

	@Override
	public List<StartedFosterInfo> findAcceptedFosters() {
		return queryFactory.select(
			Projections.constructor(
				StartedFosterInfo.class,
				foster.memberId,
				member.nickName,
				member.profileImage,
				foster.dogId,
				member.nickName,
				foster.id,
				foster.startDate
			))
			.from(foster)
			.leftJoin(dog)
			.on(dog.id.eq(foster.dogId))
			.leftJoin(member)
			.on(member.id.eq(foster.memberId))
			.where(foster.status.eq(FosterStatus.FOSTERING))
			.fetch();
	}

	@Override
	public Integer countDogFosters(Long dogId) {
		return queryFactory
			.select(foster.count().intValue())
			.from(foster)
			.where(
				foster.dogId.eq(dogId)
					.and(
						foster.status.eq(FosterStatus.FOSTERING)
							.or(foster.status.eq(FosterStatus.ACCEPTED))
					)
			)
			.fetchOne();
	}

	@Override
	public List<DogFosterResponse> getFostersByDogId(Long dogId) {
		return queryFactory
			.select(Projections.constructor(
				DogFosterResponse.class,
				foster.memberId,
				member.nickName,
				member.profileImage,
				foster.startDate
			))
			.from(foster)
			.leftJoin(member).on(foster.memberId.eq(member.id))
			.where(foster.dogId.eq(dogId)
				.and(foster.status.eq(FosterStatus.FOSTERING)))
			.fetch();
	}

	@Override
	public List<FosterApplicationResponse> getFosterApplicationsByCenterId(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				FosterApplicationResponse.class,
				foster.dogId,
				dog.name,
				dog.profileImage,
				foster.dogId.count().intValue()
			))
			.from(foster)
			.leftJoin(dog).on(foster.dogId.eq(dog.id))
			.where(dog.centerId.eq(centerId),
				foster.status.eq(FosterStatus.APPLYING))
			.groupBy(foster.dogId, dog.name, dog.profileImage)
			.orderBy(foster.dogId.count().desc())
			.fetch();
	}

	@Override
	public List<FosterApplicationByDogResponse> getFosterApplicationsByDogId(Long dogId, String name) {
		return queryFactory
			.select(Projections.constructor(
				FosterApplicationByDogResponse.class,
				foster.id,
				member.id,
				member.name,
				member.profileImage,
				member.phone,
				foster.createdAt
			))
			.from(foster)
			.leftJoin(member).on(foster.memberId.eq(member.id))
			.leftJoin(dog).on(foster.dogId.eq(dog.id))
			.where(foster.dogId.eq(dogId),
				foster.status.eq(FosterStatus.APPLYING),
				containsName(name))
			.fetch();
	}

	@Override
	public List<FosteredDogResponse> getFosteredDogsByCenterId(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				FosteredDogResponse.class,
				foster.id,
				foster.dogId,
				dog.name,
				dog.profileImage,
				foster.memberId,
				member.name,
				member.profileImage,
				foster.startDate
			))
			.from(foster)
			.leftJoin(dog).on(foster.dogId.eq(dog.id))
			.leftJoin(member).on(foster.memberId.eq(member.id))
			.where(dog.centerId.eq(centerId),
				foster.status.eq(FosterStatus.FOSTERING))
			.orderBy(foster.id.desc())
			.fetch();
	}

	private BooleanExpression containsName(String name) {
		return name != null ? dog.name.contains(name) : null;
	}
}
