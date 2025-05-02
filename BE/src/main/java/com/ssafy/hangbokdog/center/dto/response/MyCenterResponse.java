package com.ssafy.hangbokdog.center.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.domain.CenterGrade;

public record MyCenterResponse(
	String centerName,
	CenterGrade centerGrade,
	LocalDateTime joinedDate
) {
}
