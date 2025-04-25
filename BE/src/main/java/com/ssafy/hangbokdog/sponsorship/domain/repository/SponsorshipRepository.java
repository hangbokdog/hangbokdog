package com.ssafy.hangbokdog.sponsorship.domain.repository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SponsorshipRepository {

	private final SponsorshipJpaRepository sponsorshipJpaRepository;
}
