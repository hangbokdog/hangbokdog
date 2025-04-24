package com.ssafy.hangbokdog.post.comment.dto;

public record CommentCreateRequest(
        Long parentId,
        String content
) {
}
