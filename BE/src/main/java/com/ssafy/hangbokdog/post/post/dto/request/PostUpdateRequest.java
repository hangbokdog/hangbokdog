package com.ssafy.hangbokdog.post.post.dto.request;

public record PostUpdateRequest(
        // TODO: 게시글을 수정할 때, 게시판을 옮기는 경우가 있다면 추가
        Long dogId,
        String title,
        String content
) {
}
