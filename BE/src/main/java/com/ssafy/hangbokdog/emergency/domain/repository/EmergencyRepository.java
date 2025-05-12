package com.ssafy.hangbokdog.emergency.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.emergency.domain.Emergency;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyRepository {

	private final EmergencyJpaRepository emergencyJpaRepository;

	public Emergency save(Emergency emergency) {
		return emergencyJpaRepository.save(emergency);
	}
}
