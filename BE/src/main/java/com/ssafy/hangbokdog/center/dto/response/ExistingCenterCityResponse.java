package com.ssafy.hangbokdog.center.dto.response;

import java.util.List;

import com.ssafy.hangbokdog.center.domain.enums.CenterCity;

public record ExistingCenterCityResponse(
	List<CenterCity> centerCities
) {
}
