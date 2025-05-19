package com.ssafy.hangbokdog.volunteer.event.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

import com.ssafy.hangbokdog.volunteer.event.application.VolunteerService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VolunteerEventScheduler {

    private final VolunteerService volunteerService;

    @Scheduled(cron = "* 1/3 * * * *")
    @SchedulerLock(name = "volunteerEventExpireScheduler", lockAtLeastFor = "170s", lockAtMostFor = "179s")
    public void volunteerEventExpireScheduler() {
        volunteerService.expireVolunteers();
    }

    @Scheduled(cron = "* 1/3 * * * *")
    @SchedulerLock(name = "volunteerEventCompleteScheduler", lockAtLeastFor = "170s", lockAtMostFor = "179s")
    public void volunteerEventCompleteScheduler() {
        volunteerService.completeVolunteers();
    }
}
