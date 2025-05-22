package com.ssafy.hangbokdog.center.center.dto.response;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public record MainCenterResponse(
		Long centerId,
		String centerName,
		CenterGrade centerGrade
) {
}
