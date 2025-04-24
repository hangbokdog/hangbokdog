package com.ssafy.hangbokdog.donationhistory.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.donationhistory.domain.DonationHistory;

public interface DonationHistoryJpaRepository extends JpaRepository<DonationHistory, Long> {
}
