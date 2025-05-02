package com.ssafy.hangbokdog.center.dto.response;

public record CenterSearchResponse(
		Long centerId,
		String centerName,
		String status
) {
}
