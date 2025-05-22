package com.ssafy.hangbokdog.post.post.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.post.post.dto.PostLikeCount;

public interface PostLikeQueryRepository {

	List<PostLikeCount> findPostLikeCountIn(List<Long> postIds);
}
