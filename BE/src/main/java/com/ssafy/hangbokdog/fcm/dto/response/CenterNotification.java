package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.fcm.domain.NotificationType;

public record CenterNotification(
        boolean isApproved,
        LocalDateTime createdAt,
        NotificationType type
) {
    public static CenterNotification from(boolean isApproved) {
        return new CenterNotification(isApproved, LocalDateTime.now(), NotificationType.CENTER);
    }
}
