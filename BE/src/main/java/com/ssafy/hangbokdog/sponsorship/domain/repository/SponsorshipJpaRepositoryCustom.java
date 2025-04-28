package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;

public interface SponsorshipJpaRepositoryCustom {

	int countActiveSponsorshipByDogId(Long dogId);

	List<ActiveSponsorshipInfo> getActiveSponsorships();

	void bulkUpdateSponsorshipStatus(List<Long> sponsorshipIds);
}
