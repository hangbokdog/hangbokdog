package com.ssafy.hangbokdog.fcm.dto.response;

import java.time.LocalDateTime;

public record CenterNotification(
        boolean isApproved,
        LocalDateTime createdAt
) {
    public static CenterNotification from(boolean isApproved) {
        return new CenterNotification(isApproved, LocalDateTime.now());
    }
}
