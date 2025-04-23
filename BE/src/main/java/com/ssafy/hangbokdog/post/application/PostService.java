package com.ssafy.hangbokdog.post.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.domain.Post;
import com.ssafy.hangbokdog.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.dto.response.PostResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Long create(
            Member member,
            PostCreateRequest request,
            List<String> imageUrls
    ) {
        Post newPost = Post.builder()
                .authorId(member.getId())
                .boardTypeId(request.boardTypeId())
                .title(request.title())
                .content(request.content())
                .imageUrls(imageUrls)
                .build();

        postRepository.save(newPost);

        return newPost.getId();
    }

    public PageInfo<PostResponse> findAll(String pageToken) {
        return postRepository.findAll(pageToken);
    }

    public PostResponse findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));
    }
}
