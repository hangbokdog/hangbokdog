package com.ssafy.hangbokdog.fcm.dto.event;

public record CenterMemberEvent(
		String centerName,
		Long memberId,
		Boolean isApproved
) {
}
