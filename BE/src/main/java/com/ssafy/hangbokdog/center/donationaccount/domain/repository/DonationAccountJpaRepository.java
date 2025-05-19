package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;

public interface DonationAccountJpaRepository
	extends JpaRepository<DonationAccount, Long>, DonationAccountJpaRepositoryCustom {

	@Query("""
			SELECT da.balance
			FROM DonationAccount da
			WHERE da.centerId=:centerId
			""")
	Long getDonationAccountBalance(Long centerId);
}
