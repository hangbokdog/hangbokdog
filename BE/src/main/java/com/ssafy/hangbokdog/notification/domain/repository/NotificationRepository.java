package com.ssafy.hangbokdog.notification.domain.repository;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class NotificationRepository extends BaseEntity {

	private final NotificationJpaRepository notificationJpaRepository;
}
