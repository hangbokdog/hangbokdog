package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.MonthlyChallenge;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MonthlyChallengeRepository {

	private final MonthlyChallengeJpaRepository monthlyChallengeJpaRepository;

	public void save(MonthlyChallenge monthlyChallenge) {
		monthlyChallengeJpaRepository.save(monthlyChallenge);
	}
}
