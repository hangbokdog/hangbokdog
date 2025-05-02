package com.ssafy.hangbokdog.center.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.domain.CenterGrade;

public record CenterNameResponse(
	String centerName,
	CenterGrade centerGrade,
	LocalDateTime joinedDate
) {
}
