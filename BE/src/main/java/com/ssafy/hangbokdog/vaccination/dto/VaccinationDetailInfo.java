package com.ssafy.hangbokdog.vaccination.dto;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;

public record VaccinationDetailInfo(
	Long vaccinationId,
	String title,
	String content,
	LocalDateTime operatedDate,
	Long authorId,
	String authorName,
	String authorProfileImage,
	VaccinationStatus status
) {
}
