package com.ssafy.hangbokdog.member.dto.request;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;

public record FcmTokenUpdateRequest(
	String fcmToken
) {
	public void validate() {
		if (fcmToken == null || fcmToken.isBlank()) {
			throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_TOKEN);
		}
	}
}