package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.fcm.domain.NotificationType;

public record VolunteerNotification(
        Long volunteerEventId,
        String content,
        LocalDateTime createdAt,
        NotificationType type
) {
    public static VolunteerNotification of(
            Long volunteerEventId,
            String content
    ) {
        return new VolunteerNotification(volunteerEventId, content, LocalDateTime.now(), NotificationType.VOLUNTEER);
    }
}
