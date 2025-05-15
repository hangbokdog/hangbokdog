package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;

public record AdoptionApplicationResponse(
	Long dogId,
	String dogName,
	String dogImage,
	Integer count,
	LocalDateTime createdAt
) {
}
