package com.ssafy.hangbokdog.emergency.emergency.dto;

import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;

public record AppliedEmergencies(
	Long emergencyId,
	EmergencyApplicationStatus status
) {
}
