package com.ssafy.hangbokdog.adoption.dto.response;

import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record AdoptionSearchResponse(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender,
	boolean isFavorite,
	int favoriteCount,
	Boolean isStar
) {
}
