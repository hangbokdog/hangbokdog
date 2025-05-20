package com.ssafy.hangbokdog.member.dto.response;

public record MemberProfileResponse(
		Long memberId,
		String name,
		String nickName,
		String profileImage,
		Boolean notification
) {
}
