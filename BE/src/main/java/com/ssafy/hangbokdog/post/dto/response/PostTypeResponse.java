package com.ssafy.hangbokdog.post.dto.response;

import com.ssafy.hangbokdog.post.domain.PostType;

import lombok.Builder;

@Builder
public record PostTypeResponse(
        Long id,
        String name
        // TODO: 게시글 수 추가하기
) {
    public static PostTypeResponse from(PostType postType) {
        return PostTypeResponse.builder()
                .id(postType.getId())
                .name(postType.getName())
                .build();
    }
}
