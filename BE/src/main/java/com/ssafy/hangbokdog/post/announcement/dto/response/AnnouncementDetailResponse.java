package com.ssafy.hangbokdog.post.announcement.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record AnnouncementDetailResponse(
	Long id,
	Long authorId,
	String authorName,
	String authorImage,
	String title,
	String content,
	List<String> imageUrls,
	LocalDateTime createdAt
) {
}
