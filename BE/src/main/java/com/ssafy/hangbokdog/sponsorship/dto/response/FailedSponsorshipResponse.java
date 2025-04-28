package com.ssafy.hangbokdog.sponsorship.dto.response;

import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;

public record FailedSponsorshipResponse(
	Long sponsorshipId,
	SponsorShipStatus status,
	int amount,
	Long dogId,
	String dogName,
	String dogImage
) {
}
