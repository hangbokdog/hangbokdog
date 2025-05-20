package com.ssafy.hangbokdog.notification.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.notification.domain.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;
}
