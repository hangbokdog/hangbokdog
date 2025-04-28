package com.ssafy.hangbokdog.sponsorship.dto;

public record FailedSponsorshipInfo(
	Long memberId,
	String memberName,
	Long dogId,
	String dogName,
	Long failedAmount,
	Long sponsorshipId
) {
}
