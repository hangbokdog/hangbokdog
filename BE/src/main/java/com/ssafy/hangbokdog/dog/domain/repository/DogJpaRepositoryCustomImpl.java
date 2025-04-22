package com.ssafy.hangbokdog.dog.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.dog.domain.QDog.*;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogJpaRepositoryCustomImpl implements DogJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public DogDetailResponse getDogDetail(Long id) {
		return queryFactory.select(
			Projections.constructor(
				DogDetailResponse.class,
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
				dog.dogBreed
			))
			.from(dog)
			.leftJoin(center)
			.on(dog.centerId.eq(center.id))
			.where(dog.id.eq(id))
			.fetchOne();
	}
}
