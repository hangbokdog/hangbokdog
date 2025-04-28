package com.ssafy.hangbokdog.dog.dto;

public record DogCenterInfo(
	Long centerId,
	String centerName,
	int sponsorshipAmount
) {
}
