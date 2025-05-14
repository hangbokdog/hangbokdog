package com.ssafy.hangbokdog.vaccination.dto;

import java.time.LocalDateTime;
import java.util.List;

public record VaccinationSummaryInfo(
	Long vaccinationId,
	String title,
	String content,
	LocalDateTime operatedDate,
	List<Long> locationIds
) {
}
