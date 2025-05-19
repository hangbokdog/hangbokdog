package com.ssafy.hangbokdog.donation.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.donation.domain.DonationHistory;
import com.ssafy.hangbokdog.donation.dto.response.DonationAmountResponse;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final DonationHistoryJpaRepository donationHistoryJpaRepository;
    private final DonationHistoryJdbcRepository donationHistoryJdbcRepository;

    public DonationHistory save(DonationHistory donationHistory) {
        return donationHistoryJpaRepository.save(donationHistory);
    }

    public PageInfo<DonationHistoryResponse> findAllByDonorId(Long id, Long centerId, String pageToken) {
        var data = donationHistoryJpaRepository.findAllByDonorId(id, centerId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, DonationHistoryResponse::id);
    }

    public void bulkInsert(List<DonationHistory> donationHistoryList) {
        donationHistoryJdbcRepository.batchInsert(donationHistoryList);
    }

    public DonationAmountResponse getDonationAmountByCenterIdAndMemberId(Long centerId, Long memberId) {
        return donationHistoryJpaRepository.getDonationAmountByCenterIdAndMemberId(centerId, memberId);
    }

    public Long getMonthlyDonationAmountByCenterId(
        Long centerId,
        LocalDateTime monthStart,
        LocalDateTime monthEnd
    ) {
        return donationHistoryJpaRepository.getMonthlyDonationAmountByCenterId(
            centerId,
            monthStart,
            monthEnd
        );
    }
}
