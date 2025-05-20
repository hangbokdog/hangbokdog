package com.ssafy.hangbokdog.notification.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.notification.domain.Notification;
import com.ssafy.hangbokdog.notification.dto.response.NotificationResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationRepository extends BaseEntity {

	private static final int NOTIFICATION_PAGE_SIZE = 10;

	private final NotificationJpaRepository notificationJpaRepository;
	private final NotificationJdbcRepository notificationJdbcRepository;

	public void bulkInsert(List<Notification> notifications) {
		notificationJdbcRepository.batchInsert(notifications);
	}

	public void insert(Notification notification) {
		notificationJpaRepository.save(notification);
	}

	public PageInfo<NotificationResponse> getNotifications(Long memberId, String pageToken) {
		var data = notificationJpaRepository.getNotifications(memberId, pageToken, NOTIFICATION_PAGE_SIZE);
		return PageInfo.of(data, NOTIFICATION_PAGE_SIZE, NotificationResponse::notificationId);
	}

	public void readNotification(List<Long> notificationIds) {
		notificationJdbcRepository.bulkUpdateIn(notificationIds);
	}

	public Optional<Notification> getNotification(Long notificationId) {
		return notificationJpaRepository.findById(notificationId);
	}

	public void delete(Long notificationId) {
		notificationJpaRepository.deleteById(notificationId);
	}
}
