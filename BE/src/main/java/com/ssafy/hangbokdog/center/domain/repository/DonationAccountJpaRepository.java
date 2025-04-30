package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.domain.DonationAccount;

public interface DonationAccountJpaRepository
	extends JpaRepository<DonationAccount, Long>, DonationAccountJpaRepositoryCustom {
}
