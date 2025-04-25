package com.ssafy.hangbokdog.sponsorship.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;

public interface SponsorshipJpaRepository extends JpaRepository<Sponsorship, Long> {
}
