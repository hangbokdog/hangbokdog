package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;

public interface DonationAccountJpaRepository
	extends JpaRepository<DonationAccount, Long>, DonationAccountJpaRepositoryCustom {
}
