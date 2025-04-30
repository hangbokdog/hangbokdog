package com.ssafy.hangbokdog.center.application;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DonationAccountScheduler {

	private final DonationAccountService donationAccountService;

	@Scheduled(fixedRate = 300000)
	public void applyTransactionsToDonationAccount() {
		donationAccountService.applyTransactionsToDonationAccount();
	}

}
