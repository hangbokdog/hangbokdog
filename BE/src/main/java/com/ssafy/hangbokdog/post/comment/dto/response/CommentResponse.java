package com.ssafy.hangbokdog.post.comment.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public record CommentResponse(
        MemberInfo author,
        Boolean isAuthor,
        Long id,
        Long parentId,
        String content,
        Boolean isDeleted,
        LocalDateTime createdAt
) {
}
