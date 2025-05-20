package com.ssafy.hangbokdog.emergency.emergency.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyStatus;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;

public record EmergencyResponse(
	Long emergencyId,
	Long centerId,
	Long authorId,
	String name,
	String title,
	String content,
	String memberImage,
	LocalDateTime dueDate,
	Integer capacity,
	Integer targetAmount,
	EmergencyType type,
	EmergencyApplicationStatus status,
	EmergencyStatus emergencyStatus
) {
}
