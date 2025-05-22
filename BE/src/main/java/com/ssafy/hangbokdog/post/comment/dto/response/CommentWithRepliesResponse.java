package com.ssafy.hangbokdog.post.comment.dto.response;

import java.util.List;

public record CommentWithRepliesResponse(
        CommentResponse                  comment,
        List<CommentWithRepliesResponse> replies
) {
}
