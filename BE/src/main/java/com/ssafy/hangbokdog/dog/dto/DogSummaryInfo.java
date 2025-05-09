package com.ssafy.hangbokdog.dog.dto;

import com.ssafy.hangbokdog.dog.domain.enums.Gender;

public record DogSummaryInfo(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender
) {
}
