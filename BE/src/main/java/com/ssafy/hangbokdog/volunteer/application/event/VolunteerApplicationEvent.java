package com.ssafy.hangbokdog.volunteer.application.event;

public record VolunteerApplicationEvent(
        Long memberId,
        String title,
        boolean isApprove
) {
}
