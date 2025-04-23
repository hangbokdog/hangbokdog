package com.ssafy.hangbokdog.post.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public record PostResponse(
    MemberInfo author,
    PostTypeResponse postType,
    Long postId,
    String title,
    String content,
    List<String> images,
    LocalDateTime createdAt
) {
}
