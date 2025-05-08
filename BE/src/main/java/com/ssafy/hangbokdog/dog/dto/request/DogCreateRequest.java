package com.ssafy.hangbokdog.dog.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.domain.enums.Gender;

public record DogCreateRequest(
	DogStatus status,
	Long centerId,
	String name,
	DogBreed breed,
	List<String> color,
	LocalDateTime rescuedDate,
	Double weight,
	String description,
	Boolean isStar,
	Gender gender,
	Boolean isNeutered,
	LocalDateTime birth,
	String location
) {
}
