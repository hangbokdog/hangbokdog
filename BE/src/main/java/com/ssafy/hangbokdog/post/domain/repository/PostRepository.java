package com.ssafy.hangbokdog.post.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.post.domain.Post;
import com.ssafy.hangbokdog.post.dto.response.PostResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final PostJpaRepository postJpaRepository;

    public Post save(Post post) {
        return postJpaRepository.save(post);
    }

    public PageInfo<PostResponse> findAll(String pageToken) {
        var data = postJpaRepository.findAll(pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, PostResponse::postId);
    }

    public Optional<PostResponse> findById(Long postId) {
        return postJpaRepository.findByPostId(postId);
    }
}
