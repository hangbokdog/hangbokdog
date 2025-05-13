package com.ssafy.hangbokdog.center.center.dto.response;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterStatus;

public record CenterSearchResponse(
		Long centerJoinRequestId,
		Long centerId,
		String centerName,
		CenterCity centerCity,
		CenterStatus status
) {
}
