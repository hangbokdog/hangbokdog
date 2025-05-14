package com.ssafy.hangbokdog.adoption.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.adoption.domain.Adoption;

public interface AdoptionJpaRepository extends JpaRepository<Adoption, Long> {
}
