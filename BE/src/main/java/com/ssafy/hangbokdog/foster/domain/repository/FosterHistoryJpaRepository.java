package com.ssafy.hangbokdog.foster.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.foster.domain.FosterHistory;

public interface FosterHistoryJpaRepository extends JpaRepository<FosterHistory, Long> {
}
