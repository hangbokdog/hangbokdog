package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.ApprovedCount;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyInfo;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyRepository {

	private final EmergencyJpaRepository emergencyJpaRepository;

	public Emergency save(Emergency emergency) {
		return emergencyJpaRepository.save(emergency);
	}

	public List<EmergencyInfo> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now) {
		return emergencyJpaRepository.getEmergenciesByCenterId(centerId, type, now);
	}

	public List<EmergencyInfo> getLatestEmergenciesByCenterId(
			Long centerId,
			EmergencyType type,
			LocalDateTime now
	) {
		return emergencyJpaRepository.getLatestEmergenciesByCenterId(centerId, type, now);
	}

	public Optional<Emergency> getEmergencyById(Long id) {
		return emergencyJpaRepository.findById(id);
	}

	public Integer countEmergenciesByType(EmergencyType type, Long centerId) {
		return emergencyJpaRepository.countEmergenciesByEmergencyType(type, centerId);
	}

	public void deleteEmergencyById(Long id) {
		emergencyJpaRepository.deleteById(id);
	}

	public List<EmergencyInfo> getRecruitedEmergencies(Long centerId) {
		return emergencyJpaRepository.getRecruitedEmergencies(centerId);
	}

	public List<ApprovedCount> getApprovedCountIn(List<Long> emergencyIds) {
		return emergencyJpaRepository.getApprovedCountIn(emergencyIds);
	}
}
