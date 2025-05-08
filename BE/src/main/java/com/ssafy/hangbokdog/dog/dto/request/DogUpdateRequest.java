package com.ssafy.hangbokdog.dog.dto.request;

public record DogUpdateRequest(
	String dogName,
	Double weight,
	String description,
	Boolean isNeutered,
	String location
) {
}
