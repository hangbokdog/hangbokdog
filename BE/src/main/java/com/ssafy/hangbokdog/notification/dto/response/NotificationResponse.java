package com.ssafy.hangbokdog.notification.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.fcm.domain.NotificationType;

public record NotificationResponse(
		Long notificationId,
		Long targetId,
		NotificationType type,
		String title,
		String content,
		LocalDateTime createdAt
) {
}
