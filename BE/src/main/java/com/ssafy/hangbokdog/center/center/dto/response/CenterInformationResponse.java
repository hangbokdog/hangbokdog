package com.ssafy.hangbokdog.center.center.dto.response;

public record CenterInformationResponse(
	Integer totalDogCount,
	Integer lastMonthDogCount,
	Integer fosterCount,
	Integer lastMonthFosterCount,
	Integer adoptionCount,
	Long monthlyDonationAmount,
	Integer hospitalCount,
	Integer protectedDog,
	Long centerMileageAmount
) {
}
