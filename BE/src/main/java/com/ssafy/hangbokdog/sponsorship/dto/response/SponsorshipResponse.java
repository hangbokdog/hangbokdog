package com.ssafy.hangbokdog.sponsorship.dto.response;

import java.util.List;

import com.ssafy.hangbokdog.sponsorship.dto.FailedSponsorshipInfo;

public record SponsorshipResponse(
	Integer succeededSponsorshipCount,
	Integer failedSponsorshipCount,
	List<FailedSponsorshipInfo> failedSponsorshipInfos
) {
}
