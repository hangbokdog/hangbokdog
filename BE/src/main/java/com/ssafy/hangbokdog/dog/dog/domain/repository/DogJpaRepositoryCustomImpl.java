package com.ssafy.hangbokdog.dog.dog.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QAddressBook.*;
import static com.ssafy.hangbokdog.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
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

	@Override
	public List<DogSummaryInfo> searchDogs(
		String name,
		DogBreed breed,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		String location,
		Boolean isStar,
		Long centerId,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
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
			.leftJoin(addressBook)
			.on(dog.locationId.eq(addressBook.id))
			.where(
				dog.centerId.eq(centerId),
				isInRange(pageToken),
				hasName(name),
				hasBreed(breed),
				hasGender(gender),
				isNeuteredEq(isNeutered),
				isStarEq(isStar),
				inBirthRange(start, end),
				hasLocation(location)
			)
			.orderBy(dog.createdAt.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return dog.createdAt.lt(LocalDateTime.parse(pageToken));
	}

	private BooleanExpression hasName(String name) {
		return (name == null || name.isBlank()) ? null : dog.name.containsIgnoreCase(name);
	}

	private BooleanExpression hasBreed(DogBreed breed) {
		return (breed == null) ? null : dog.dogBreed.eq(breed);
	}

	private BooleanExpression hasGender(Gender gender) {
		return (gender == null) ? null : dog.gender.eq(gender);
	}

	private BooleanExpression isNeuteredEq(Boolean isNeutered) {
		return (isNeutered == null) ? null : dog.isNeutered.eq(isNeutered);
	}

	private BooleanExpression inBirthRange(LocalDateTime start, LocalDateTime end) {
		if (start != null && end != null) {
			return dog.birth.between(start, end);
		} else if (start != null) {
			return dog.birth.goe(start);
		} else if (end != null) {
			return dog.birth.loe(end);
		} else {
			return null;
		}
	}

	private BooleanExpression hasLocation(String location) {
		return (location == null || location.isBlank()) ? null : addressBook.addressName.eq(location);
	}

	private BooleanExpression isStarEq(Boolean isStar) {
		return (isStar == null) ? null : dog.isStar.eq(isStar);
	}
}
