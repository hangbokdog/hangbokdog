package com.ssafy.hangbokdog.center.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenter.center;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.dto.CenterSearchInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterJpaRepositoryCustomImpl implements CenterJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CenterSearchInfo> getCentersByName(String name) {
		return queryFactory
				.select(Projections.constructor(
						CenterSearchInfo.class,
						center.id,
						center.name,
						center.centerCity
				))
				.from(center)
				.where(hasName(name))
				.fetch();
	}

	private BooleanExpression hasName(String name) {
		return (name == null || name.isBlank()) ? null : center.name.containsIgnoreCase(name);
	}
}
