package com.ssafy.hangbokdog.post.dto.request;

public record CommentCreateRequest(
        Long parentId,
        String content
) {
}
