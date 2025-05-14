package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;

public record AdoptionApplicationResponse(
	Long adoptionId,
	Long dogId,
	String dogName,
	String dogImage,
	Long memberId,
	String memberName,
	LocalDateTime created_at
) {
}
