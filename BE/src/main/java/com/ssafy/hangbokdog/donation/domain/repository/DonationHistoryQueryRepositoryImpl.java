package com.ssafy.hangbokdog.donation.domain.repository;

import static com.ssafy.hangbokdog.donation.domain.QDonationHistory.donationHistory;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryQueryRepositoryImpl implements DonationHistoryQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<DonationHistoryResponse> findAllByDonorId(Long donorId, String pageToken, int pageSize) {
        return queryFactory.select(
                Projections.constructor(
                        DonationHistoryResponse.class,
                        donationHistory.id,
                        donationHistory.amount,
                        donationHistory.type,
                        donationHistory.createdAt
                )).from(donationHistory)
                .where(donationHistory.donorId.eq(donorId))
                .limit(pageSize + 1)
                .fetch();
    }
}
