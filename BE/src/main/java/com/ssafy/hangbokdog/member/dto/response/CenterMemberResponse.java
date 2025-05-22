package com.ssafy.hangbokdog.member.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public record CenterMemberResponse(
        Long id,
        String profileImage,
        String name,
        String nickname,
        CenterGrade grade,
        String email,
        String phone,
        LocalDateTime joinedAt
) {
}
