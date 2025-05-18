package com.ssafy.hangbokdog.post.post.dto.response;

import java.time.LocalDateTime;

public record PostSummaryResponse(
		Long memberId,
		String memberNickName,
		String memberImage,
		Long postId,
		String title,
		LocalDateTime createdAt,
		Boolean isLiked,
		Integer likeCount
) {
}
