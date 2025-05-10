package com.ssafy.hangbokdog.dog.comment.dto;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public record DogCommentInfo(
		MemberInfo author,
		Boolean isAuthor,
		Long id,
		Long parentId,
		String content,
		Boolean isDeleted,
		LocalDateTime createdAt
) {
}
