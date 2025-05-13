package com.ssafy.hangbokdog.post.post.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.post.domain.Post;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.post.dto.request.PostUpdateRequest;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CenterRepository centerRepository;
    private final CenterMemberRepository centerMemberRepository;

    public Long create(
            Member member,
            Long centerId,
            PostCreateRequest request,
            List<String> imageUrls
    ) {
        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        Post newPost = Post.builder()
                .centerId(centerId)
                .authorId(member.getId())
                .boardTypeId(request.boardTypeId())
                .title(request.title())
                .content(request.content())
                .imageUrls(imageUrls)
                .build();

        Post post = postRepository.save(newPost);

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
