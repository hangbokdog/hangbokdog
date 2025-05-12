package com.ssafy.hangbokdog.emergency.dto.request;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.emergency.domain.enums.TargetGrade;

public record EmergencyDonationRequest(
	String title,
	String content,
	LocalDateTime dueDate,
	Integer targetAmount,
	TargetGrade targetGrade
) {
}
