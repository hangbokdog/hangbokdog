package com.ssafy.hangbokdog.sponsorship.dto.response;

import java.time.LocalDateTime;

public record MySponsorshipResponse(
	Long sponsorshipId,
	Long dogId,
	String dogName,
	String dogImage,
	LocalDateTime startedDate
) {
}
