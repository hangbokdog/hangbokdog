package com.ssafy.hangbokdog.center.center.dto.request;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;

public record CenterCreateRequest(
	String name,
	int sponsorAmount,
	CenterCity centerCity
) {
}
