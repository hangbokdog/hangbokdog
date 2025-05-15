package com.ssafy.hangbokdog.adoption.dto;

import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record AdoptionSearchInfo(
	Long adoptionId,
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender,
	Boolean isStar) {
}
