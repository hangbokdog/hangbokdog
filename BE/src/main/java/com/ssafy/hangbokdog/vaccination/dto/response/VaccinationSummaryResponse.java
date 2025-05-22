package com.ssafy.hangbokdog.vaccination.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;
import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;

public record VaccinationSummaryResponse(
	Long vaccinationId,
	String title,
	String content,
	LocalDateTime operatedDate,
	List<LocationInfo> locationInfos,
	VaccinationStatus status
) {
}
