package com.ssafy.hangbokdog.sponsorship.application;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SponsorshipScheduler {

	private final SponsorshipService sponsorshipService;

	@Scheduled(cron = "0 0 0 1 * *")
	@SchedulerLock(name = "proceedSponsorshipsScheduler", lockAtLeastFor = "290s", lockAtMostFor = "299s")
	public void proceedSponsorships() {
		sponsorshipService.proceedSponsorship();
	}
}
