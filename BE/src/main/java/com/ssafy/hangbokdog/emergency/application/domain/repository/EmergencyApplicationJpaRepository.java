package com.ssafy.hangbokdog.emergency.application.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;

public interface EmergencyApplicationJpaRepository extends JpaRepository<EmergencyApplication, Long> {
}
