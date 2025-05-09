package com.ssafy.hangbokdog.dog.dog.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QAddressBook.*;
import static com.ssafy.hangbokdog.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.dog.domain.QDog.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogJpaRepositoryCustomImpl implements DogJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public DogDetailInfo getDogDetail(Long id, Long centerId) {
		return queryFactory.select(
			Projections.constructor(
				DogDetailInfo.class,
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
				addressBook.addressName
			))
			.from(dog)
			.leftJoin(center)
			.on(dog.centerId.eq(center.id))
			.leftJoin(addressBook)
			.on(dog.locationId.eq(addressBook.id))
			.where(dog.id.eq(id)
				.and(dog.centerId.eq(centerId)))
			.fetchOne();
	}

	@Override
	public DogCenterInfo getDogCenterInfo(Long dogId) {
		return queryFactory
			.select(
				Projections.constructor(
					DogCenterInfo.class,
					center.id,
					center.name,
					center.sponsorAmount
				))
			.from(dog)
			.leftJoin(center)
			.on(dog.centerId.eq(center.id))
			.where(dog.id.eq(dogId))
			.fetchOne();
	}

	@Override
	public List<DogSummaryInfo> getDogSummaries(Long centerId) {
		return queryFactory
			.select(Projections. constructor(
				DogSummaryInfo.class,
				dog.id,
				dog.name,
				dog.profileImage,
				Expressions.numberTemplate(
					Integer.class,
					"timestampdiff(month, {0}, now())",
					dog.birth
				),

				dog.gender
			))
			.from(dog)
			.where(dog.centerId.eq(centerId)
				.and(dog.status.ne(DogStatus.ADOPTED))
				.and(dog.isStar.eq(false)))
			.orderBy(dog.createdAt.desc())
			.limit(3)
			.fetch();
	}
}
