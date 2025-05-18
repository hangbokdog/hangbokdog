package com.ssafy.hangbokdog.emergency.emergency.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;

public interface EmergencyJpaRepository extends JpaRepository<Emergency, Long>, EmergencyJpaRepositoryCustom {
}
