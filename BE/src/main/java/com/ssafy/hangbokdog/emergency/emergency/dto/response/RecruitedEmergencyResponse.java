package com.ssafy.hangbokdog.emergency.emergency.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyApplicant;

public record RecruitedEmergencyResponse(
		Long emergencyId,
		List<EmergencyApplicant> applicants,
		String emergencyDate,
		LocalDateTime dueDate,
		String title,
		String content
) {
}
