package com.ssafy.hangbokdog.dog.dog.dto;

import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record DogSummaryInfo(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender,
	Boolean isStar
) {
}
