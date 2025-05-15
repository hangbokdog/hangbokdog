package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;

public record AdoptionApplicationByDogResponse(
	Long memberId,
	String name,
	String profileImage,
	LocalDateTime createdAt
) {
}
