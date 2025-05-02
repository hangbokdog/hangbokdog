package com.ssafy.hangbokdog.dog.dto.response;

import java.util.List;

import com.ssafy.hangbokdog.dog.dto.DogSummary;

public record ProtectedDogCountResponse(
	int count,
	List<DogSummary> dogSummaries
) {
}
