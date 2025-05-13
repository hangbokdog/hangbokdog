package com.ssafy.hangbokdog.vaccination.domain.repository;

import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.vaccination.domain.QVaccinatedDog.*;
import static com.ssafy.hangbokdog.vaccination.domain.QVaccination.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VaccinatedDogJpaRepositoryCustomImpl implements VaccinatedDogJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<VaccinationDoneResponse> getVaccinationDogsByVaccinationId(
		Long vaccinationId,
		String pageToken,
		int pageSize
	) {
		return queryFactory
			.select(Projections.constructor(
				VaccinationDoneResponse.class,
				vaccinatedDog.dogId,
				dog.name,
				dog.profileImage,
				Expressions.numberTemplate(
					Integer.class,
					"timestampdiff(month, {0}, now())",
					dog.birth
				)
			))
			.from(vaccinatedDog)
			.leftJoin(dog).on(vaccinatedDog.dogId.eq(dog.id))
			.where(vaccinatedDog.vaccinationId.eq(vaccinationId),
				isInRange(pageToken))
			.orderBy(vaccinatedDog.id.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return vaccination.id.lt(Long.parseLong(pageToken));
	}
}
