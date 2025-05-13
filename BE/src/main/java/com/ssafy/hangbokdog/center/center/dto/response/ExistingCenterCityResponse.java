package com.ssafy.hangbokdog.center.center.dto.response;

import java.util.List;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;

public record ExistingCenterCityResponse(
	List<CenterCity> centerCities
) {
}
