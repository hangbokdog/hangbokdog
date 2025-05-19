package com.ssafy.hangbokdog.post.post.dto;

import java.time.LocalDateTime;

public record PostSummaryInfo(
		Long memberId,
		String memberNickName,
		String memberImage,
		Long postId,
		String title,
		LocalDateTime createdAt,
		Long postTypeId,
		String postTypeName
) {
}
