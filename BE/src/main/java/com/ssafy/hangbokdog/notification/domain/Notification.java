package com.ssafy.hangbokdog.notification.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.fcm.domain.NotificationType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Notification extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id", nullable = false)
	private Long id;

	@Column(nullable = false, length = 100)
	private String title;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@Column(nullable = false)
	private Long receiverId;

	@Column(nullable = false)
	private Boolean isRead = false;

	@Enumerated(EnumType.STRING)
	@Column(name = "type", nullable = false)
	private NotificationType type;

	public void isRead() {
		this.isRead = true;
	}

	@Builder
	public Notification(
			String title,
			String content,
			Long receiverId,
			NotificationType type
	) {
		this.title = title;
		this.content = content;
		this.receiverId = receiverId;
		this.type = type;
		this.isRead = false;
	}
}
