package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.domain.MonthlyChallenge;

public interface MonthlyChallengeJpaRepository extends JpaRepository<MonthlyChallenge, Long> {
}
