package com.ssafy.hangbokdog.notification.dto.request;

import java.util.List;

public record NotificationReadRequest(
		List<Long> notificationIds
) {
}
