package com.ssafy.hangbokdog.sponsorship.dto;

public record ActiveSponsorshipInfo(
	Long sponsorshipId,
	Long memberId,
	String memberName,
	Long dogId,
	String dogName,
	Long mileageId,
	Long balance,
	Long amount
) {
}
