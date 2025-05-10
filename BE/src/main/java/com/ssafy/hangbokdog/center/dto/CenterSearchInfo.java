package com.ssafy.hangbokdog.center.dto;

import com.ssafy.hangbokdog.center.domain.enums.CenterCity;

public record CenterSearchInfo(
		Long id,
		String name,
		CenterCity centerCity
) {
}
