package com.ssafy.hangbokdog.dog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.dog.dog.domain.MedicalHistory;

public interface MedicalHistoryJpaRepository extends JpaRepository<MedicalHistory, Long>,
	MedicalHistoryJpaRepositoryCustom {
}
