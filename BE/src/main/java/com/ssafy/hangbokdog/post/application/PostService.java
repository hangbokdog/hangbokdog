package com.ssafy.hangbokdog.post.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.domain.Post;
import com.ssafy.hangbokdog.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.dto.request.PostUpdateRequest;
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

    public PostResponse findByPostId(Long postId) {
        return postRepository.findByPostId(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));
    }

    @Transactional
    public void update(
            Member member,
            Long postId,
            PostUpdateRequest request,
            List<String> imageUrls
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        if (!post.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.NOT_AUTHOR);
        }

        post.update(
                request.dogId(),
                request.title(),
                request.content(),
                imageUrls
        );
    }

    @Transactional
    public void delete(Member member, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        if (!post.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.NOT_AUTHOR);
        }

        postRepository.delete(post);
    }
}
