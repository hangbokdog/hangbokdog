package com.ssafy.hangbokdog.volunteer.application.dto;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record VolunteerApplicationStatusInfo(
        Long volunteerEventId,
        VolunteerApplicationStatus status
) {
}
