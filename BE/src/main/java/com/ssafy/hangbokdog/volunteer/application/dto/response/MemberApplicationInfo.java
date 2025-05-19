package com.ssafy.hangbokdog.volunteer.application.dto.response;

import java.time.LocalDate;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record MemberApplicationInfo(
        Long volunteerEventId,
        LocalDate date,
        String title,
        VolunteerApplicationStatus status
) {
}
