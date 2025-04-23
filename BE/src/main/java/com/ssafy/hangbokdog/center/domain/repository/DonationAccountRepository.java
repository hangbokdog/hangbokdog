package com.ssafy.hangbokdog.center.domain.repository;

import java.util.Optional;

import javax.swing.text.html.Option;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.DonationAccount;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationAccountRepository {

	private final DonationAccountJpaRepository donationAccountJpaRepository;

	public Optional<DonationAccount> getDonationAccountByCenterId(Long centerId) {
		return donationAccountJpaRepository.findById(centerId);
	}
}
