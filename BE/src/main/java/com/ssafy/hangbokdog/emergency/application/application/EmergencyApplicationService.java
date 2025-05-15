package com.ssafy.hangbokdog.emergency.application.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.domain.repository.EmergencyApplicationRepository;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationCreateResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmergencyApplicationService {

	private final EmergencyApplicationRepository emergencyApplicationRepository;
	private final CenterMemberRepository centerMemberRepository;

	public EmergencyApplicationCreateResponse apply(Long memberId, Long centerId, Long emergencyId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		EmergencyApplication emergencyApplication = EmergencyApplication.builder()
			.emergencyId(emergencyId)
			.applicantId(memberId)
			.status(EmergencyApplicationStatus.APPLIED)
			.build();

		return new EmergencyApplicationCreateResponse(
			emergencyApplicationRepository.save(emergencyApplication).getId());
	}

	public void delete(Long memberId, Long emergencyApplicationId) {
		EmergencyApplication emergencyApplication = emergencyApplicationRepository.findById(emergencyApplicationId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.EMERGENCY_APPLICATION_NOT_FOUND));

		emergencyApplicationRepository.delete(emergencyApplication);
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
