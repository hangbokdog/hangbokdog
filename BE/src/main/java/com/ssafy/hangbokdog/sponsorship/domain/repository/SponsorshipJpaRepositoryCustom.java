package com.ssafy.hangbokdog.sponsorship.domain.repository;

public interface SponsorshipJpaRepositoryCustom {

	int countActiveSponsorshipByDogId(Long dogId);
}
