package com.ssafy.hangbokdog.dog.comment.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public record DogCommentResponse(
	MemberInfo author,
	Boolean isAuthor,
	Long id,
	Long parentId,
	String content,
	Boolean isDeleted,
	LocalDateTime createdAt,
	Boolean isLiked,
	Integer likeCount
) {
}
