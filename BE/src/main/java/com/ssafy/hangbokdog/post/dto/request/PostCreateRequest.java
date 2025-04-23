package com.ssafy.hangbokdog.post.dto.request;

public record PostCreateRequest(
        Long boardTypeId,
        Long dogId,
        String title,
        String content
) {
}
