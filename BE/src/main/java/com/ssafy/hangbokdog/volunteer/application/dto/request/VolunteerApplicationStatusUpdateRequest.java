package com.ssafy.hangbokdog.volunteer.application.dto.request;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record VolunteerApplicationStatusUpdateRequest(
        VolunteerApplicationStatus status
) {
}
