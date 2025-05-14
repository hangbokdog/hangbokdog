package com.ssafy.hangbokdog.vaccination.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.vaccination.domain.VaccinatedDog;

public interface VaccinatedDogJpaRepository extends JpaRepository<VaccinatedDog, Long>,
	VaccinatedDogJpaRepositoryCustom {

	Integer countByVaccinationId(Long vaccinationId);
}
