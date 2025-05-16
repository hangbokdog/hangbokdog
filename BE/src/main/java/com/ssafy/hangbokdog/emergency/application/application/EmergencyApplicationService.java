package com.ssafy.hangbokdog.emergency.application.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.annotation.RedisLock;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.domain.repository.EmergencyApplicationRepository;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationCreateResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.repository.EmergencyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmergencyApplicationService {

	private final EmergencyApplicationRepository emergencyApplicationRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final EmergencyRepository emergencyRepository;

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
		EmergencyApplication emergencyApplication = getEmergencyApplication(emergencyApplicationId);

		if (!emergencyApplication.getApplicantId().equals(memberId)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHOR);
		}

		//TODO: 락 잡아서 동일한 이동 응급에 대해 여러 명이 수행 못하게 하고, 봉사 응급 정원 유지
		emergencyApplicationRepository.delete(emergencyApplication);
	}

	@RedisLock(key = "'emergencyId:' + #emergencyId")
	public void manageEmergencyApplication(
		Long memberId,
		Long centerId,
		Long emergencyApplicationId,
		EmergencyApplicationStatus request
	) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		EmergencyApplication emergencyApplication = getEmergencyApplication(emergencyApplicationId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		if (request.equals(EmergencyApplicationStatus.REJECTED)) {
			emergencyApplication.reject();
		} else {
			Emergency emergency = emergencyRepository.getEmergencyById(emergencyApplication.getEmergencyId())
				.orElseThrow(() -> new BadRequestException(ErrorCode.EMERGENCY_NOT_FOUND));

			switch (emergency.getEmergencyType()) {
				case TRANSPORT:
					if (!emergencyApplicationRepository.existsByEmergencyId(emergency.getId())) {
						throw new BadRequestException(ErrorCode.EMERGENCY_ALREADY_FULL);
					}

					emergencyApplication.approve();
					break;

				case VOLUNTEER:
					int approvedAppliesCount = emergencyApplicationRepository
						.getApprovedVolunteerApplicantsByEmergencyId(emergency.getId());

					if (!emergency.checkCapacity(approvedAppliesCount)) {
						throw new BadRequestException(ErrorCode.EMERGENCY_ALREADY_FULL);
					}

					emergencyApplication.approve();
					break;

				case DONATION:
					throw new BadRequestException(ErrorCode.INVALID_REQUEST);
			}
		}
	}

	public List<EmergencyApplicationResponse> getEmergencyApplications(
		Long memberId,
		Long centerId,
		Long emergencyId
	) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return emergencyApplicationRepository.getEmergencyApplicationsByEmergencyId(emergencyId);
	}

	public  List<EmergencyApplicationResponse> getMyEmergencyApplications(
		Long memberId,
		Long centerId,
		Long emergencyId
	) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		return emergencyApplicationRepository.getEmergencyApplicationsByEmergencyIdAndMemberId(memberId, emergencyId);
	}

	private EmergencyApplication getEmergencyApplication(Long emergencyApplicationId) {
		return emergencyApplicationRepository.findById(emergencyApplicationId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.EMERGENCY_APPLICATION_NOT_FOUND));
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
