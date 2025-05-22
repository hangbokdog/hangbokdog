package com.ssafy.hangbokdog.post.comment.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.post.comment.dto.CommentLikeInfo;

public interface CommentLikeQueryRepository {

	List<CommentLikeInfo> findCommentLikeByPostId(Long postId);
}
