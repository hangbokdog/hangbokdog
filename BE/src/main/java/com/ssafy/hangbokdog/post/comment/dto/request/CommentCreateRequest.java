package com.ssafy.hangbokdog.post.comment.dto.request;

public record CommentCreateRequest(
        Long parentId,
        String content
) {
}
