package com.ssafy.hangbokdog.donation.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.donation.domain.DonationHistory;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final DonationHistoryJpaRepository donationHistoryJpaRepository;

    public DonationHistory save(DonationHistory donationHistory) {
        return donationHistoryJpaRepository.save(donationHistory);
    }

    public PageInfo<DonationHistoryResponse> findAllByDonorId(Long id, String pageToken) {
        var data = donationHistoryJpaRepository.findAllByDonorId(id, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, DonationHistoryResponse::id);
    }
}
