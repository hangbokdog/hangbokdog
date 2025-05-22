package com.ssafy.hangbokdog.foster.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;

public record MyFosterResponse(
	Long dogId,
	String dogName,
	String profileImage,
	LocalDateTime startDate,
	FosterStatus status
) {
}
