package com.ssafy.hangbokdog.member.dto.response;

public record MemberInfo(
        Long id,
        String nickName,
        String grade,
        String profileImage
) {
}
