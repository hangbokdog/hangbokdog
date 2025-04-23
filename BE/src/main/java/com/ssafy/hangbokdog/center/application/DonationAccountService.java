package com.ssafy.hangbokdog.center.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.center.domain.DonationAccount;
import com.ssafy.hangbokdog.center.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.center.dto.response.DonationAccountBalanceResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationAccountService {

	private final DonationAccountRepository donationAccountRepository;

	public DonationAccountBalanceResponse getBalance(Long centerId) {

		DonationAccount donationAccount = donationAccountRepository.getDonationAccountByCenterId(centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DONATION_ACCOUNT_NOT_FOUND));

		return new DonationAccountBalanceResponse(donationAccount.getBalance());
	}
}
