package com.ssafy.hangbokdog.vaccination.dto.response;

public record VaccinationDoneResponse(
	Long dogId,
	String name,
	String imageUrl,
	int ageMonth
) {
}
