package com.ssafy.hangbokdog.sponsorship.domain.repository;

import static com.ssafy.hangbokdog.sponsorship.domain.QSponsorship.*;

import java.util.Objects;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SponsorshipJpaRepositoryCustomImpl implements SponsorshipJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public int countActiveSponsorshipByDogId(Long dogId) {
		return Objects.requireNonNull(queryFactory
				.select(sponsorship.count())
				.from(sponsorship)
				.where(
					sponsorship.status.eq(SponsorShipStatus.ACTIVE),
					sponsorship.dogId.eq(dogId)
				)
				.fetchOne())
			.intValue();
	}

}
