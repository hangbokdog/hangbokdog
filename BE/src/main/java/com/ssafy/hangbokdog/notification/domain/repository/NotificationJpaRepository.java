package com.ssafy.hangbokdog.notification.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.notification.domain.Notification;

public interface NotificationJpaRepository extends JpaRepository<Notification, Long>, NotificationJpaRepositoryCustom {

    @Query("DELETE FROM Notification n WHERE n.receiverId = :receiverId")
    void deleteAllByReceiverId(Long receiverId);
}
