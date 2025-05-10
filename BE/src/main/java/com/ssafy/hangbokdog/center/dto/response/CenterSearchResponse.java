package com.ssafy.hangbokdog.center.dto.response;

import com.ssafy.hangbokdog.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.domain.enums.CenterStatus;

public record CenterSearchResponse(
		Long centerJoinRequestId,
		Long centerId,
		String centerName,
		CenterCity centerCity,
		CenterStatus status
) {
}
