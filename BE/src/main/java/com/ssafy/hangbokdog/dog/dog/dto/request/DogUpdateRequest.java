package com.ssafy.hangbokdog.dog.dog.dto.request;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;

public record DogUpdateRequest(
	String dogName,
	Double weight,
	String description,
	Boolean isNeutered,
	Long locationId,
	DogBreed dogBreed
) {
}
