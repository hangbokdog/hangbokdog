package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;

public record AdoptionApplicationByDogResponse(
	Long adoptionId,
	Long memberId,
	String name,
	String profileImage,
	String phoneNumber,
	LocalDateTime createdAt
) {
}
