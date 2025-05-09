package com.ssafy.hangbokdog.dog.dog.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.dog.dog.domain.enums.MedicalType;

public record MedicalHistoryResponse(
	Long id,
	String content,
	Integer medicalPeriod,
	MedicalType medicalType,
	LocalDateTime operatedDate,
	String image
) {
}
