package com.ssafy.hangbokdog.vaccination.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;

public record VaccinationSummaryInfo(
	Long vaccinationId,
	String title,
	String content,
	LocalDateTime operatedDate,
	List<Long> locationIds,
	VaccinationStatus status
) {
}
