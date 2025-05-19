package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.fcm.domain.NotificationType;

public record CenterNotification(
        String content,
        boolean isApproved,
        LocalDateTime createdAt,
        NotificationType type
) {
    public static CenterNotification of(String content, boolean isApproved) {
        return new CenterNotification(content, isApproved, LocalDateTime.now(), NotificationType.CENTER);
    }
}
