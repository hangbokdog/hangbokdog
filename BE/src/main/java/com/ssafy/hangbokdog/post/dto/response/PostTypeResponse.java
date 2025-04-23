package com.ssafy.hangbokdog.post.dto.response;

import com.ssafy.hangbokdog.post.domain.PostType;

import lombok.Builder;

@Builder
public record PostTypeResponse(
        Long id,
        String name
) {
    public static PostTypeResponse from(PostType postType) {
        return PostTypeResponse.builder()
                .id(postType.getId())
                .name(postType.getName())
                .build();
    }
}
