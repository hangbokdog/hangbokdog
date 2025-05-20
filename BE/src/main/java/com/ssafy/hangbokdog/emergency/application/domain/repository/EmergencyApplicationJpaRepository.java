package com.ssafy.hangbokdog.emergency.application.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.emergency.application.domain.EmergencyApplication;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;

public interface EmergencyApplicationJpaRepository
	extends JpaRepository<EmergencyApplication, Long>, EmergencyApplicationJpaRepositoryCustom {

	@Query("""
		SELECT COUNT(ea.id)
		FROM EmergencyApplication ea
		WHERE ea.emergencyId = :emergencyId AND ea.status = :status
		""")
	Integer getApprovedVolunteerApplicantsByEmergencyId(Long emergencyId, EmergencyApplicationStatus status);

	Boolean existsByEmergencyIdAndStatus(Long emergencyId, EmergencyApplicationStatus status);
}
