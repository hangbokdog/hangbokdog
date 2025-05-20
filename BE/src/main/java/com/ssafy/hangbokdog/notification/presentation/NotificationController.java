package com.ssafy.hangbokdog.notification.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.notification.application.NotificationService;
import com.ssafy.hangbokdog.notification.dto.response.NotificationResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationService;

	@GetMapping
	public ResponseEntity<PageInfo<NotificationResponse>> getNotifications(
			@AuthMember Member member,
			@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok().body(notificationService.getNotifications(member.getId(), pageToken));
	}
}
