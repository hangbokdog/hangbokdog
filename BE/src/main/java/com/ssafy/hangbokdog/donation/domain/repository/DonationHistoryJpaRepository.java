package com.ssafy.hangbokdog.donation.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.donation.domain.DonationHistory;

public interface DonationHistoryJpaRepository
        extends JpaRepository<DonationHistory, Long>, DonationHistoryQueryRepository {
}
