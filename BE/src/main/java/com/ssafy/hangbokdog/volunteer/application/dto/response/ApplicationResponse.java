package com.ssafy.hangbokdog.volunteer.application.dto.response;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record ApplicationResponse(
        Long id,
        Long memberId,
        Long volunteerId,
        VolunteerApplicationStatus status
) {
}
