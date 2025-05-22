package com.ssafy.hangbokdog.volunteer.application.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

public record WeeklyApplicationResponse(
        LocalDate date,
        List<VolunteerApplicationInfo> applications

) {
    public record VolunteerApplicationInfo(
            Long applicationId,
            VolunteerInfo volunteer,
            VolunteerApplicationStatus status
    ) {
    }
}

