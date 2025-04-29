package com.ssafy.hangbokdog.center.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.DonationAccount;
import com.ssafy.hangbokdog.center.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.center.dto.response.DonationAccountBalanceResponse;
import com.ssafy.hangbokdog.center.dto.response.DonationAccountReportResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationAccountService {

	private final DonationAccountRepository donationAccountRepository;
	private final TransactionRepository transactionRepository;

	public DonationAccountBalanceResponse getBalance(Long centerId) {

		DonationAccount donationAccount = getDonationAccount(centerId);

		return new DonationAccountBalanceResponse(donationAccount.getBalance());
	}

	@Transactional
	public void applyTransactionsToDonationAccount() {

		List<CenterKeyInfo> centerKeyInfos = donationAccountRepository.getCenterKeyInfos();

		Map<Long, TransactionInfo> transactionInfos = transactionRepository.getTransactionInfoByCenter(centerKeyInfos);

		donationAccountRepository.bulkUpdateDonationAccounts(transactionInfos);
	}

	private DonationAccount getDonationAccount(Long centerId) {
		return donationAccountRepository.getDonationAccountByCenterId(centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DONATION_ACCOUNT_NOT_FOUND));
	}
}
