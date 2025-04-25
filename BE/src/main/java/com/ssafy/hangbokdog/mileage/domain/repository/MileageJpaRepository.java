package com.ssafy.hangbokdog.mileage.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.mileage.domain.Mileage;

public interface MileageJpaRepository extends JpaRepository<Mileage, Long> {
    Optional<Mileage> findByMemberId(Long memberId);
}
