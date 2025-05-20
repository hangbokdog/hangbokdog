package com.ssafy.hangbokdog.notification.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.notification.dto.response.NotificationResponse;

public interface NotificationJpaRepositoryCustom {

	List<NotificationResponse> getNotifications(Long memberId, String pageToken, int pageSize);
}
