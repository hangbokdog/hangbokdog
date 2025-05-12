package com.ssafy.hangbokdog.emergency.domain.repository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmergencyRepository {

	private final EmergencyJpaRepository emergencyJpaRepository;
}
