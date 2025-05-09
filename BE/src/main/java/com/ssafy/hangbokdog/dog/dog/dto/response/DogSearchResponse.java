package com.ssafy.hangbokdog.dog.dog.dto.response;

import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record DogSearchResponse(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender,
	boolean isFavorite,
	int favoriteCount
) {
}
