package com.ssafy.hangbokdog.vaccination.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.vaccination.domain.Vaccination;

public interface VaccinationJpaRepository extends JpaRepository<Vaccination, Long>, VaccinationJpaRepositoryCustom {

	@Query("""
			SELECT vd.dogId
			FROM VaccinatedDog vd
			WHERE vd.vaccinationId = :vaccinationId
		""")
	List<Long> getVaccinatedDogIdsByVaccinationId(Long vaccinationId);
}
