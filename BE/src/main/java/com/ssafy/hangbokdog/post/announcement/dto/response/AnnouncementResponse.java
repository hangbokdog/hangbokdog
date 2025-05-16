package com.ssafy.hangbokdog.post.announcement.dto.response;

import java.time.LocalDateTime;

public record AnnouncementResponse(
	Long id,
	Long authorId,
	String authorName,
	String authorImage,
	String title,
	LocalDateTime createdAt
) {
}
