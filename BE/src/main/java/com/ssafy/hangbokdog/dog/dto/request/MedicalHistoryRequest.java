package com.ssafy.hangbokdog.dog.dto.request;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.dog.domain.enums.MedicalType;

public record MedicalHistoryRequest(
	String content,
	Integer medicalPeriod,
	MedicalType medicalType,
	LocalDateTime operatedDate
) {
}
