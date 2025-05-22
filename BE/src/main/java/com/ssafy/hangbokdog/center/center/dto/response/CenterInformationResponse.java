package com.ssafy.hangbokdog.center.center.dto.response;

public record CenterInformationResponse(
	Integer totalDogCount,
	Integer lastMonthDogCount,
	Integer fosterCount,
	Integer lastMonthFosterCount,
	Integer adoptionCount,
	int monthlyVolunteerParticipantCount,
	Integer hospitalCount,
	Integer protectedDog,
	Long centerMileageAmount
) {
}
