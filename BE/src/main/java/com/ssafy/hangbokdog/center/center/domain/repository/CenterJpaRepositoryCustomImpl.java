package com.ssafy.hangbokdog.center.center.domain.repository;

import static com.ssafy.hangbokdog.center.center.domain.QCenter.center;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.ExistingCityResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterJpaRepositoryCustomImpl implements CenterJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CenterSearchInfo> getCentersByName(String name, CenterCity centerCity) {
		return queryFactory
				.select(Projections.constructor(
						CenterSearchInfo.class,
						center.id,
						center.name,
						center.centerCity
				))
				.from(center)
				.where(hasName(name),
					hasCity(centerCity))
				.fetch();
	}

	@Override
	public List<ExistingCityResponse> getExistingCities() {
		return queryFactory
			.select(Projections.constructor(
				ExistingCityResponse.class,
				center.id.count().intValue(),
				center.centerCity
			))
			.from(center)
			.groupBy(center.centerCity)
			.fetch();
	}

	private BooleanExpression hasName(String name) {
		return (name == null || name.isBlank()) ? null : center.name.containsIgnoreCase(name);
	}

	private BooleanExpression hasCity(CenterCity centerCity) {
		return (centerCity == null) ? null : center.centerCity.eq(centerCity);
	}
}
