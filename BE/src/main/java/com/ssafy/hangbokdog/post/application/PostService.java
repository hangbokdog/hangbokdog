package com.ssafy.hangbokdog.post.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.domain.Post;
import com.ssafy.hangbokdog.post.domain.repository.PostJpaRepository;
import com.ssafy.hangbokdog.post.dto.request.PostCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostJpaRepository postJpaRepository;

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

        postJpaRepository.save(newPost);

        return newPost.getId();
    }
}
