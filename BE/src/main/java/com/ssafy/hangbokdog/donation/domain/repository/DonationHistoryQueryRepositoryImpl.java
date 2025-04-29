package com.ssafy.hangbokdog.donation.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenter.*;
import static com.ssafy.hangbokdog.donation.domain.QDonationHistory.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryQueryRepositoryImpl implements DonationHistoryQueryRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<DonationHistoryResponse> findAllByDonorId(
		Long donorId,
		Long centerId,
		String pageToken,
		int pageSize
	) {
		return queryFactory.select(
				Projections.constructor(
					DonationHistoryResponse.class,
					donationHistory.id,
					donationHistory.amount,
					donationHistory.type,
					donationHistory.createdAt,
					donationHistory.centerId,
					center.name
				)).from(donationHistory)
			.leftJoin(center)
			.on(donationHistory.centerId.eq(centerId))
			.where(donationHistory.donorId.eq(donorId),
				centerIdEq(centerId))
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression centerIdEq(Long centerId) {
		return centerId != null ? donationHistory.centerId.eq(centerId) : null;
	}
}
