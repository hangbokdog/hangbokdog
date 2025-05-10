package com.ssafy.hangbokdog.center.dto.response;

import com.ssafy.hangbokdog.center.domain.enums.CenterCity;

public record AppliedCenterResponse(
		Long centerId,
		String centerName,
		CenterCity centerCity
) {
}
