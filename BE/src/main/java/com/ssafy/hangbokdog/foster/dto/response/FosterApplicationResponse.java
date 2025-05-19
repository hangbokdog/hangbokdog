package com.ssafy.hangbokdog.foster.dto.response;

public record FosterApplicationResponse(
	Long dogId,
	String dogName,
	String dogImage,
	Integer count
) {
}
