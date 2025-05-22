package com.ssafy.hangbokdog.center.center.dto.response;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;

public record ExistingCityResponse(
	int count,
	CenterCity centerCity
) {
}
