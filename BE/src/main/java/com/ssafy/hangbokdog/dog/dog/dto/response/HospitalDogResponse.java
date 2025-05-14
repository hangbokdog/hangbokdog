package com.ssafy.hangbokdog.dog.dog.dto.response;

public record HospitalDogResponse(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth
) {
}
