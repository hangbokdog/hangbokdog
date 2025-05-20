package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyInfo;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;

public interface EmergencyJpaRepositoryCustom {

	List<EmergencyInfo> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now);

	List<EmergencyInfo> getLatestEmergenciesByCenterId(
			Long centerId,
			EmergencyType type,
			LocalDateTime now
	);

	Integer countEmergenciesByEmergencyType(EmergencyType emergencyType, Long centerId);
}
