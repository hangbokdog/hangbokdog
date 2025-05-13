package com.ssafy.hangbokdog.center.center.dto;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;

public record CenterSearchInfo(
		Long id,
		String name,
		CenterCity centerCity
) {
}
