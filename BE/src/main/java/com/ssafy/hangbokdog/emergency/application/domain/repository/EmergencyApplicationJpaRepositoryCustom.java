package com.ssafy.hangbokdog.emergency.application.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;

public interface EmergencyApplicationJpaRepositoryCustom {
	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyId(Long emergencyId);
	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(Long memberId, Long emergencyId);
}
