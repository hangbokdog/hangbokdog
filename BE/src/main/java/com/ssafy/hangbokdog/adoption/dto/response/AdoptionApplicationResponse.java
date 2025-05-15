package com.ssafy.hangbokdog.adoption.dto.response;

public record AdoptionApplicationResponse(
	Long dogId,
	String dogName,
	String dogImage,
	Integer count
) {
}
