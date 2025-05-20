package com.ssafy.hangbokdog.emergency.application.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.emergency.application.dto.response.AllEmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.AppliedEmergencies;

public interface EmergencyApplicationJpaRepositoryCustom {
	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyId(Long emergencyId);

	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(
		Long memberId,
		Long emergencyId
	);

	List<AppliedEmergencies> getEmergencyApplicationsByMemberId(Long memberId);

	List<AllEmergencyApplicationResponse> getEmergencyApplicationsByCenterId(Long centerId);
}
