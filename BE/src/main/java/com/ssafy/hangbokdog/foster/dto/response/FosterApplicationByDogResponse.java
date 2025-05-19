package com.ssafy.hangbokdog.foster.dto.response;

import java.time.LocalDateTime;

public record FosterApplicationByDogResponse(
	Long adoptionId,
	Long memberId,
	String name,
	String profileImage,
	String phoneNumber,
	LocalDateTime createdAt
) {
}
