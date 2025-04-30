package com.ssafy.hangbokdog.center.application;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DonationAccountScheduler {

	private final DonationAccountService donationAccountService;

	@Scheduled(fixedRate = 300000)
	@SchedulerLock(name = "donationAccountScheduler", lockAtLeastFor = "290s", lockAtMostFor = "299s")
	public void applyTransactionsToDonationAccount() {
		donationAccountService.applyTransactionsToDonationAccount();
	}

}
