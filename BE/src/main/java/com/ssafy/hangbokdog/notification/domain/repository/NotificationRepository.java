package com.ssafy.hangbokdog.notification.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.notification.domain.Notification;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationRepository extends BaseEntity {

	private final NotificationJpaRepository notificationJpaRepository;
	private final NotificationJdbcRepository notificationJdbcRepository;

	public void bulkInsert(List<Notification> notifications) {
		notificationJdbcRepository.batchInsert(notifications);
	}

	public void insert(Notification notification) {
		notificationJpaRepository.save(notification);
	}
}
