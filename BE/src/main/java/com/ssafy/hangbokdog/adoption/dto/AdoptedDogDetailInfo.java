package com.ssafy.hangbokdog.adoption.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record AdoptedDogDetailInfo(
	Long dogId,
	DogStatus dogStatus,
	Long centerId,
	String centerName,
	String dogName,
	String profileImageUrl,
	List<String> color,
	LocalDateTime rescuedDate,
	Double weight,
	String description,
	Boolean isStar,
	Gender gender,
	Boolean isNeutered,
	DogBreed breed,
	int age,
	LocalDateTime adoptedDate,
	Long adopterId,
	String adopterName,
	String adopterImage
) {
}
