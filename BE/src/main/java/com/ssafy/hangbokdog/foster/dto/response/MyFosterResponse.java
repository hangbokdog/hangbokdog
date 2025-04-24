package com.ssafy.hangbokdog.foster.dto.response;

import java.time.LocalDateTime;

public record MyFosterResponse(
	Long dogId,
	String dogName,
	String profileImage,
	LocalDateTime startDate
) {
}
