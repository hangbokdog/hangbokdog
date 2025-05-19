package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

public record VolunteerNotification(
        Long volunteerEventId,
        String content,
        LocalDateTime createdAt
) {
    public static VolunteerNotification of(
            Long volunteerEventId,
            String content
    ) {
        return new VolunteerNotification(volunteerEventId, content, LocalDateTime.now());
    }
}
