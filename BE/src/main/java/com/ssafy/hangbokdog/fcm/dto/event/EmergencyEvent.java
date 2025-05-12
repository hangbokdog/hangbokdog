package com.ssafy.hangbokdog.fcm.dto.event;

import com.ssafy.hangbokdog.emergency.domain.enums.TargetGrade;

public record EmergencyEvent(
	Long emergencyId,
	Long centerId,
	String title,
	String content,
	String centerName,
	TargetGrade targetGrade
) {
}
