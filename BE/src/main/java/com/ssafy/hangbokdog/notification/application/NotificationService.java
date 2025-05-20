package com.ssafy.hangbokdog.notification.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.notification.domain.repository.NotificationRepository;
import com.ssafy.hangbokdog.notification.dto.request.NotificationReadRequest;
import com.ssafy.hangbokdog.notification.dto.response.NotificationResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;

	public PageInfo<NotificationResponse> getNotifications(Long memberId, String pageToken) {
		return notificationRepository.getNotifications(memberId, pageToken);
	}

	@Transactional
	public void readNotifications(NotificationReadRequest request) {
		notificationRepository.readNotification(request.notificationIds());
	}
}
