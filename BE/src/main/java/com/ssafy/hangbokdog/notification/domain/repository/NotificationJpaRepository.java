package com.ssafy.hangbokdog.notification.domain.repository;

import com.ssafy.hangbokdog.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationJpaRepository extends JpaRepository<Notification, Long> {

}
