package com.ssafy.hangbokdog.dog.dto;

import com.ssafy.hangbokdog.dog.domain.enums.Gender;

public record DogSummary(
	String name,
	String imageUrl,
	int ageMonth,
	Gender gender
) {}
