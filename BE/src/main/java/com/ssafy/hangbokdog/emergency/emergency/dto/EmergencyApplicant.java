package com.ssafy.hangbokdog.emergency.emergency.dto;

public record EmergencyApplicant(
		Long memberId,
		String name,
		String nickName,
		String phone,
		Long emergencyId
) {
}
