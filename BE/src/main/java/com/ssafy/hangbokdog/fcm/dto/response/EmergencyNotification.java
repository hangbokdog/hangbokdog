package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.fcm.domain.NotificationType;

public record EmergencyNotification(
        Long emergencyId,
        String centerName,
        NotificationType type,
        String content,
        LocalDateTime createdAt
) {
    public static EmergencyNotification of(
            Long emergencyId,
            String centerName,
            NotificationType type,
            String content
    ) {
        return new EmergencyNotification(emergencyId, centerName, type, content, LocalDateTime.now());
    }
}
