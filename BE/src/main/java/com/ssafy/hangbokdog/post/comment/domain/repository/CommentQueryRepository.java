package com.ssafy.hangbokdog.post.comment.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.post.comment.dto.CommentInfo;
import com.ssafy.hangbokdog.post.comment.dto.CommentLikeInfo;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentResponse;

public interface CommentQueryRepository {
    List<CommentInfo> findAllByPostId(Long postId, Long loginId);

    CommentResponse findByCommentId(Long commentId, Long loginId);
}
