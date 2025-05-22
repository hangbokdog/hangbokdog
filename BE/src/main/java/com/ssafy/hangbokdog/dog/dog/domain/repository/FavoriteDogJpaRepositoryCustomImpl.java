package com.ssafy.hangbokdog.dog.dog.domain.repository;

import static com.ssafy.hangbokdog.dog.dog.domain.QFavoriteDog.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.dog.dto.FavoriteDogCount;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FavoriteDogJpaRepositoryCustomImpl implements FavoriteDogJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<FavoriteDogCount> getFavoriteCountByDogIds(List<Long> dogIds) {
		return queryFactory
			.select(Projections.constructor(
				FavoriteDogCount.class,
				favoriteDog.dogId,
				favoriteDog.dogId.count().intValue()
			))
			.from(favoriteDog)
			.where(favoriteDog.dogId.in(dogIds))
			.groupBy(favoriteDog.dogId)
			.fetch();
	}
}
