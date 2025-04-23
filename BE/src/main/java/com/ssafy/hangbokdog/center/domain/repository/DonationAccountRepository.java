package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationAccountRepository {

	private final DonationAccountJpaRepository donationAccountJpaRepository;
}
