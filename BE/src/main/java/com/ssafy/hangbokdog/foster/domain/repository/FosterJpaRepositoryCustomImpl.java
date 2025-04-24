package com.ssafy.hangbokdog.foster.domain.repository;

import static com.ssafy.hangbokdog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.foster.domain.QFoster.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
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
				foster.startDate
			))
			.from(foster)
			.leftJoin(dog)
			.on(dog.id.eq(foster.dogId))
			.where(foster.memberId.eq(memberId)
				.and(foster.status.eq(FosterStatus.FOSTERING)))
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
}
