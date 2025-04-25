package com.ssafy.hangbokdog.post.post.domain.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;

public interface PostQueryRepository {
    List<PostResponse> findAll(String pageToken, int pageSize);

    Optional<PostResponse> findByPostId(Long postId);
}
