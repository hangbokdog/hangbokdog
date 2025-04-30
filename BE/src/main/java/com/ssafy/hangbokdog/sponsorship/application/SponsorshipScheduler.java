package com.ssafy.hangbokdog.sponsorship.application;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SponsorshipScheduler {

	private final SponsorshipService sponsorshipService;

	@Scheduled(cron = "0 0 0 1 * *")
	public void proceedSponsorships() {
		sponsorshipService.proceedSponsorship();
	}
}
