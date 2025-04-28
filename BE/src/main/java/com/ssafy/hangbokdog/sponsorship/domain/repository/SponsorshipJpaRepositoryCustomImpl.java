package com.ssafy.hangbokdog.sponsorship.domain.repository;

import static com.ssafy.hangbokdog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;
import static com.ssafy.hangbokdog.mileage.domain.QMileage.*;
import static com.ssafy.hangbokdog.sponsorship.domain.QSponsorship.*;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;

import com.ssafy.hangbokdog.sponsorship.dto.response.FailedSponsorshipResponse;
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

	@Override
	public List<ActiveSponsorshipInfo> getActiveSponsorships() {
		return queryFactory
			.select(
			Projections.constructor(
				ActiveSponsorshipInfo.class,
				sponsorship.id,
				sponsorship.memberId,
				member.nickName,
				sponsorship.dogId,
				dog.name,
				mileage.id,
				mileage.balance,
				sponsorship.amount
			))
			.from(sponsorship)
			.leftJoin(mileage)
			.on(sponsorship.memberId.eq(mileage.memberId))
			.leftJoin(dog)
			.on(sponsorship.dogId.eq(dog.id))
			.leftJoin(member)
			.on(sponsorship.memberId.eq(member.id))
			.where(sponsorship.status.eq(SponsorShipStatus.ACTIVE))
			.fetch();
	}

	@Override
	public void bulkUpdateSponsorshipStatus(List<Long> sponsorshipIds) {
		queryFactory.update(sponsorship)
			.set(sponsorship.status, SponsorShipStatus.FAILED)
			.where(sponsorship.id.in(sponsorshipIds))
			.execute();
	}

	@Override
	public List<FailedSponsorshipResponse> getFailedSponsorships(Long memberId) {
		return queryFactory
			.select(
				Projections.constructor(
					FailedSponsorshipResponse.class,
					sponsorship.id,
					sponsorship.status,
					sponsorship.amount,
					sponsorship.dogId,
					dog.name,
					dog.profileImage
				))
			.from(sponsorship)
			.leftJoin(dog)
			.on(sponsorship.dogId.eq(dog.id))
			.where(sponsorship.memberId.eq(memberId)
				.and(sponsorship.status.eq(SponsorShipStatus.FAILED)))
			.fetch();
	}
}
