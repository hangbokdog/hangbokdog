package com.ssafy.hangbokdog.post.dto.request;

public record PostCreateRequest(
        Long boardTypeId,
        String title,
        String content
) {
}
