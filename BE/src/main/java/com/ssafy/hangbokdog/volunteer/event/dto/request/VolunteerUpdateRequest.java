package com.ssafy.hangbokdog.volunteer.event.dto.request;

public record VolunteerUpdateRequest(
        String title,
        String content,
        String activityLog,
        String precaution,
        String info
) {
}
