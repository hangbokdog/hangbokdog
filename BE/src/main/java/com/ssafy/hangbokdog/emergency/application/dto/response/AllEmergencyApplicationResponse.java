package com.ssafy.hangbokdog.emergency.application.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;

public record AllEmergencyApplicationResponse(
	Long emergencyId,
	String emergencyName,
	Long emergencyApplicationId,
	Long memberId,
	String memberName,
	String memberImage,
	String phone,
	LocalDateTime createdAt,
	EmergencyApplicationStatus status
) {
}
