package com.ssafy.hangbokdog.emergency.application.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.emergency.application.dto.response.AllEmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.AppliedEmergencies;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyApplicant;

public interface EmergencyApplicationJpaRepositoryCustom {
	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyId(Long emergencyId);

	List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(Long memberId);

	List<AppliedEmergencies> getEmergencyApplicationsByMemberId(Long memberId);

	List<AllEmergencyApplicationResponse> getEmergencyApplicationsByCenterId(Long centerId);

	Boolean existsByMemberIdAndEmergencyId(Long memberId, Long emergencyId);

	List<EmergencyApplicant> getEmergencyApplicantsByIn(List<Long> emergencyIds);
}
