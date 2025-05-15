package com.ssafy.hangbokdog.emergency.application.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyApplicationRepository {

	private final EmergencyApplicationJpaRepository emergencyApplicationJpaRepository;

	public EmergencyApplication save(EmergencyApplication emergencyApplication) {
		return emergencyApplicationJpaRepository.save(emergencyApplication);
	}

	public Optional<EmergencyApplication> findById(Long id) {
		return emergencyApplicationJpaRepository.findById(id);
	}

	public void delete(EmergencyApplication emergencyApplication) {
		emergencyApplicationJpaRepository.delete(emergencyApplication);
	}

	public int getApprovedVolunteerApplicantsByEmergencyId(Long emergencyId) {
		return emergencyApplicationJpaRepository.getApprovedVolunteerApplicantsByEmergencyId(
			emergencyId,
			EmergencyApplicationStatus.APPROVED
		);
	}

	public boolean existsByEmergencyId(Long emergencyId) {
		return emergencyApplicationJpaRepository.existsByEmergencyIdAndStatus(
			emergencyId,
			EmergencyApplicationStatus.APPROVED
		);
	}

	public List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyId(Long emergencyId) {
		return emergencyApplicationJpaRepository.getEmergencyApplicationsByEmergencyId(emergencyId);
	}

	public List<EmergencyApplicationResponse> getEmergencyApplicationsByEmergencyIdAndMemberId(
		Long memberId,
		Long emergencyId
	) {
		return emergencyApplicationJpaRepository.getEmergencyApplicationsByEmergencyIdAndMemberId(
			memberId,
			emergencyId
		);
	}
}
