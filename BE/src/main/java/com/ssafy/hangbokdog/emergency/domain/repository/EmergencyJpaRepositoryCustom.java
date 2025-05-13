package com.ssafy.hangbokdog.emergency.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.dto.response.EmergencyResponse;

public interface EmergencyJpaRepositoryCustom {

	List<EmergencyResponse> getEmergenciesByCenterId(Long centerId, EmergencyType type, LocalDateTime now);
}
