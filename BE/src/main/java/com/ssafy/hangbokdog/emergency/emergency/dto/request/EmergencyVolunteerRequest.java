package com.ssafy.hangbokdog.emergency.emergency.dto.request;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.emergency.emergency.domain.enums.TargetGrade;

public record EmergencyVolunteerRequest(
	String title,
	String content,
	LocalDateTime dueDate,
	Integer capacity,
	TargetGrade targetGrade
) {
}
