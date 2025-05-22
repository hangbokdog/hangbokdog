package com.ssafy.hangbokdog.sponsorship.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.sponsorship.domain.SponsorshipHistory;

public interface SponsorshipHistoryJpaRepository extends JpaRepository<SponsorshipHistory, Long> {
}
