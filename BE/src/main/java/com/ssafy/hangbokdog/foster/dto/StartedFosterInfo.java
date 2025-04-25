package com.ssafy.hangbokdog.foster.dto;

import java.time.LocalDateTime;

public record StartedFosterInfo(
	Long memberId,
	String name,
	String profileImage,
	Long dogId,
	String dogName,
	Long fosterId,
	LocalDateTime startTime
) {
}
