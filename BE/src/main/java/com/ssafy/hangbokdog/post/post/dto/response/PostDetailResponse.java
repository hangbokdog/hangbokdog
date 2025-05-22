package com.ssafy.hangbokdog.post.post.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public record PostDetailResponse(
		MemberInfo author,
		PostTypeResponse postType,
		Long postId,
		Long dogId,
		String title,
		String content,
		List<String> images,
		LocalDateTime createdAt,
		Boolean isLiked,
		Integer likeCount) {
}
