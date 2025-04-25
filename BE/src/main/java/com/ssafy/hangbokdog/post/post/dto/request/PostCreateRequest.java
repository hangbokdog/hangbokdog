package com.ssafy.hangbokdog.post.post.dto.request;

public record PostCreateRequest(
        Long boardTypeId,
        Long dogId,
        String title,
        String content
) {
}
