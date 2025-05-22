package com.ssafy.hangbokdog.dog.comment.dto.request;

public record DogCommentCreateRequest(
	Long parentId,
	String content
) {
}
