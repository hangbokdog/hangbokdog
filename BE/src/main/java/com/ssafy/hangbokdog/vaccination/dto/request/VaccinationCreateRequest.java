package com.ssafy.hangbokdog.vaccination.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public record VaccinationCreateRequest(
	String title,
	String content,
	LocalDateTime operatedDate,
	List<Long> locationIds
) {
}
