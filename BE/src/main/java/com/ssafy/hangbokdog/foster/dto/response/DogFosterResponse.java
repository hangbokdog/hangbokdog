package com.ssafy.hangbokdog.foster.dto.response;

import java.time.LocalDateTime;

public record DogFosterResponse(
	Long memberId,
	String name,
	String profileImage,
	LocalDateTime startTime
) {
}
