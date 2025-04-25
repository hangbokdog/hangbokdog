package com.ssafy.hangbokdog.donation.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.donation.domain.DonationHistory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryRepository {

    private final DonationHistoryJpaRepository donationHistoryJpaRepository;

    public DonationHistory save(DonationHistory donationHistory) {
        return donationHistoryJpaRepository.save(donationHistory);
    }
}
