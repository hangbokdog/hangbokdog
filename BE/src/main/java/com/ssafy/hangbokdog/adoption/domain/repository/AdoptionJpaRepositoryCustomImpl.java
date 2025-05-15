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
import com.ssafy.hangbokdog.adoption.dto.AdoptionSearchInfo;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdoptionJpaRepositoryCustomImpl implements AdoptionJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				AdoptionApplicationResponse.class,
				adoption.dogId,
				dog.name,
				dog.profileImage,
				adoption.dogId.count().intValue()
			))
			.from(adoption)
			.leftJoin(dog).on(adoption.dogId.eq(dog.id))
			.where(dog.centerId.eq(centerId),
				adoption.status.eq(AdoptionStatus.APPLIED))
			.groupBy(adoption.dogId, dog.name, dog.profileImage)
			.orderBy(adoption.dogId.count().desc())
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

	@Override
	public List<AdoptionApplicationByDogResponse> getAdoptionApplicationsByDogId(Long dogId, String name) {
		return queryFactory
			.select(Projections.constructor(
				AdoptionApplicationByDogResponse.class,
				member.id,
				member.name,
				member.profileImage,
				member.phone,
				adoption.createdAt
			))
			.from(adoption)
			.leftJoin(member).on(adoption.memberId.eq(member.id))
			.leftJoin(dog).on(adoption.dogId.eq(dog.id))
			.where(adoption.dogId.eq(dogId),
				adoption.status.eq(AdoptionStatus.APPLIED),
				containsName(name))
			.fetch();
	}

	@Override
	public List<AdoptionSearchInfo> search(
		String name,
		Long centerId,
		List<DogBreed> breeds,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		Boolean isStar,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
				AdoptionSearchInfo.class,
				adoption.id,
				dog.id,
				dog.name,
				dog.profileImage,
				Expressions.numberTemplate(Integer.class, "timestampdiff(MONTH, {0}, {1})", dog.birth,
					LocalDateTime.now()),
				dog.gender,
				dog.isStar
			))
			.from(adoption)
			.join(dog).on(adoption.dogId.eq(dog.id))
			.where(
				dog.centerId.eq(centerId),
				adoption.status.eq(AdoptionStatus.ACCEPTED),
				containsName(name),
				inBreeds(breeds),
				genderEq(gender),
				betweenBirth(start, end),
				isNeuteredEq(isNeutered),
				isStarEq(isStar),
				isInRange(pageToken)
			)
			.orderBy(adoption.id.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression containsName(String name) {
		return name != null ? dog.name.contains(name) : null;
	}

	private BooleanExpression inBreeds(List<DogBreed> breeds) {
		return breeds != null && !breeds.isEmpty() ? dog.dogBreed.in(breeds) : null;
	}

	private BooleanExpression genderEq(Gender gender) {
		return gender != null ? dog.gender.eq(gender) : null;
	}

	private BooleanExpression betweenBirth(LocalDateTime start, LocalDateTime end) {
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

	private BooleanExpression isNeuteredEq(Boolean isNeutered) {
		return isNeutered != null ? dog.isNeutered.eq(isNeutered) : null;
	}

	private BooleanExpression isStarEq(Boolean isStar) {
		return isStar != null ? dog.isStar.eq(isStar) : null;
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return adoption.id.lt(Long.parseLong(pageToken));
	}
}
