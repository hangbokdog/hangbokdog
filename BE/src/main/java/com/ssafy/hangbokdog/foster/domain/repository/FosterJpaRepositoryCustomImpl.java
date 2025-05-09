package com.ssafy.hangbokdog.foster.domain.repository;

import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.foster.domain.QFoster.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
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
				.or(foster.status.eq(FosterStatus.REJECTED)))
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
}
