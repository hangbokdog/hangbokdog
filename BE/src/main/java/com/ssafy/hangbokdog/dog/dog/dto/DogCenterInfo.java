package com.ssafy.hangbokdog.dog.dog.dto;

public record DogCenterInfo(
	Long centerId,
	String centerName,
	int sponsorshipAmount
) {
}
