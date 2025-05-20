package com.ssafy.hangbokdog.member.dto.response;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public record MemberResponse(
        Long id,
        String name,
        String nickname,
        String profileImage,
        CenterGrade centerGrade,
        Long centerMemberId
) {
}
