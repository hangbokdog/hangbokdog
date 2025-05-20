package com.ssafy.hangbokdog.foster.dto.response;

import java.time.LocalDateTime;

public record FosteredDogResponse(
	Long fosterId,
	Long dogId,
	String dogName,
	String dogImage,
	Long memberId,
	String memberName,
	String memberImage,
	LocalDateTime created_at
) {
}
