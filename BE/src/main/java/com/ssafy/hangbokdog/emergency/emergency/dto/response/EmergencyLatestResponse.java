package com.ssafy.hangbokdog.emergency.emergency.dto.response;

import java.util.List;

public record EmergencyLatestResponse(
		Integer count,
		List<EmergencyResponse> emergencies
) {
}
