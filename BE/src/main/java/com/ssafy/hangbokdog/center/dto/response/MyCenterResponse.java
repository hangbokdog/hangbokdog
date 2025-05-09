package com.ssafy.hangbokdog.center.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.domain.enums.CenterGrade;

public record MyCenterResponse(
	Long centerId,
	String centerName,
	CenterGrade centerGrade,
	LocalDateTime joinedDate
) {
}
