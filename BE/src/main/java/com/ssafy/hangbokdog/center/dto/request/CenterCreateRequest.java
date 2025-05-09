package com.ssafy.hangbokdog.center.dto.request;

import com.ssafy.hangbokdog.center.domain.enums.CenterCity;

public record CenterCreateRequest(
	String name,
	int sponsorAmount,
	CenterCity centerCity
) {
}
