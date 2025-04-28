package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;
import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;

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

	public List<ActiveSponsorshipInfo> getActiveSponsorships() {
		return sponsorshipJpaRepositoryCustom.getActiveSponsorships();
	}

	public void bulkUpdateSponsorshipStatus(List<Long> sponsorshipIds) {
		sponsorshipJpaRepositoryCustom.bulkUpdateSponsorshipStatus(sponsorshipIds);
	}
}
