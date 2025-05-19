package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;

public record MyAdoptionResponse(
	Long dogId,
	String dogName,
	String profileImage,
	LocalDateTime startDate,
	AdoptionStatus status
) {
}
