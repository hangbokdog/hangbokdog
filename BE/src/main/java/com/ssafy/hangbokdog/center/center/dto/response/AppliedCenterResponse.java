package com.ssafy.hangbokdog.center.center.dto.response;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;

public record AppliedCenterResponse(
		Long centerJoinRequestId,
		Long centerId,
		String centerName,
		CenterCity centerCity
) {
}
