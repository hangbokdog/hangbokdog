package com.ssafy.hangbokdog.volunteer.application.dto.request;

import java.time.LocalDate;
import java.util.List;

public record VolunteerApplicationCreateRequest(
        List<ApplicationRequest> applications
) {
    public record ApplicationRequest(
            LocalDate date,
            List<Long> volunteerSlotIds,
            List<Long> participantIds
    ) {
    }
}
