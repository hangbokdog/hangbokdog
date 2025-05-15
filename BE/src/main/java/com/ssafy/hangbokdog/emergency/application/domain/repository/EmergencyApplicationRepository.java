package com.ssafy.hangbokdog.emergency.application.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;

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
}
