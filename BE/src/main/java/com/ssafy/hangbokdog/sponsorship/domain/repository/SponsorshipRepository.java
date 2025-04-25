package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SponsorshipRepository {

	private final SponsorshipJpaRepository sponsorshipJpaRepository;
	private final SponsorshipJpaRepositoryCustomImpl sponsorshipJpaRepositoryCustom;

	public Sponsorship createSponsorship(Sponsorship sponsorship) {
		return sponsorshipJpaRepository.save(sponsorship);
	}

	public int countActiveSponsorshipByDogId(Long dogId) {
		return sponsorshipJpaRepositoryCustom.countActiveSponsorshipByDogId(dogId);
	}

	public Optional<Sponsorship> findSponsorshipById(Long id) {
		return sponsorshipJpaRepository.findById(id);
	}
}
