package com.ssafy.hangbokdog.dog.comment.dto.response;

import java.util.List;

public record DogCommentWithRepliesResponse(
	DogCommentResponse dogComment,
	List<DogCommentWithRepliesResponse> replies
) {
}
