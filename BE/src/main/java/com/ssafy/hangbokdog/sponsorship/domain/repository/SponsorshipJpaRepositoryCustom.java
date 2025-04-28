package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;
import com.ssafy.hangbokdog.sponsorship.dto.response.FailedSponsorshipResponse;

public interface SponsorshipJpaRepositoryCustom {

	int countActiveSponsorshipByDogId(Long dogId);

	List<ActiveSponsorshipInfo> getActiveSponsorships();

	void bulkUpdateSponsorshipStatus(List<Long> sponsorshipIds);

	List<FailedSponsorshipResponse> getFailedSponsorships(Long memberId);
}
