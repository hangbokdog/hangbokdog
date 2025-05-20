package com.ssafy.hangbokdog.volunteer.application.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record MemberApplicationInfo(
        Long volunteerEventId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String title,
        VolunteerApplicationStatus status
) {
}
