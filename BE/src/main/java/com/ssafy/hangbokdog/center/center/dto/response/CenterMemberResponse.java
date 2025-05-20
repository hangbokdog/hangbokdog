package com.ssafy.hangbokdog.center.center.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public record CenterMemberResponse(
	Long centerMemberId,
	Long memberId,
	String memberName,
	String memberNickname,
	String memberImage,
	LocalDateTime createAt,
	CenterGrade grade
) {
}
