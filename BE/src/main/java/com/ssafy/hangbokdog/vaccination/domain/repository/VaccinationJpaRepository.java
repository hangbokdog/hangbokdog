package com.ssafy.hangbokdog.vaccination.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.vaccination.domain.Vaccination;

public interface VaccinationJpaRepository extends JpaRepository<Vaccination, Long>, VaccinationJpaRepositoryCustom {
}
