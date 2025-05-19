package com.ssafy.hangbokdog.volunteer.application.event;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record VolunteerApplicationEvent(
        Long volunteerEventId,
        Long memberId,
        String title,
        VolunteerApplicationStatus state
) {
}
