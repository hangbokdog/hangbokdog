package com.ssafy.hangbokdog.sponsorship.dto;

public record FailedSponsorshipInfo(
	Long memberId,
	String memberName,
	Long dogId,
	String dogName,
	int failedAmount,
	Long sponsorshipId
) {
}
