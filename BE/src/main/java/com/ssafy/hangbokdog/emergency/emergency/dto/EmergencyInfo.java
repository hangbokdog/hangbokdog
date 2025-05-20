package com.ssafy.hangbokdog.emergency.emergency.dto;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;

public record EmergencyInfo(
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
	EmergencyType type
) {
}
