package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationAccountRepository {

	private final DonationAccountJpaRepository donationAccountJpaRepository;

	public DonationAccount createDonationAccount(DonationAccount donationAccount) {
		return donationAccountJpaRepository.save(donationAccount);
	}

	public Optional<DonationAccount> getDonationAccountByCenterId(Long centerId) {
		return donationAccountJpaRepository.findById(centerId);
	}

	public Long getDonationAccountBalance(Long centerId) {
		return donationAccountJpaRepository.getDonationAccountBalance(centerId);
	}

	public List<CenterKeyInfo> getCenterKeyInfos() {
		return donationAccountJpaRepository.getCenterKeyInfos();
	}

	public void bulkUpdateDonationAccounts(Map<Long, TransactionInfo> transactionInfos) {
		donationAccountJpaRepository.bulkUpdateDonationAccounts(transactionInfos);
	}
}
