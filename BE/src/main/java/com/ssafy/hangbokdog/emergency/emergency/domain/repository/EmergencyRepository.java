package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyRepository {

	private final EmergencyJpaRepository emergencyJpaRepository;

	public Emergency save(Emergency emergency) {
		return emergencyJpaRepository.save(emergency);
	}

	public List<EmergencyResponse> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now) {
		return emergencyJpaRepository.getEmergenciesByCenterId(centerId, type, now);
	}
}
