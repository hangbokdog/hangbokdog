package com.ssafy.hangbokdog.center.center.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public record MyCenterResponse(
	Long centerId,
	String centerName,
	CenterGrade centerGrade,
	CenterCity centerCity,
	LocalDateTime joinedDate
) {
}
