package com.ssafy.hangbokdog.fcm.dto.event;

public record EmergencyPostEvent(
		Long postId,
		Long centerId,
		String title,
		String body,
		String centerName
) {
}
