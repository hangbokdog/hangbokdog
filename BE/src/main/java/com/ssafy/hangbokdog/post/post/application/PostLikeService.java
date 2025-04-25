package com.ssafy.hangbokdog.post.post.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.post.domain.PostLike;
import com.ssafy.hangbokdog.post.post.domain.repository.PostLikeJpaRepository;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.post.dto.response.PostLikeResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeJpaRepository postLikeJpaRepository;
    private final PostRepository postRepository;

    @Transactional
    public PostLikeResponse toggleLike(Long postId, Member member) {
        postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        boolean exists = postLikeJpaRepository.existsByPostIdAndMemberId(postId, member.getId());

        if (exists) {
            postLikeJpaRepository.deleteByPostIdAndMemberId(postId, member.getId());
            return new PostLikeResponse(false);
        }

        PostLike postLike = PostLike.builder()
                .postId(postId)
                .memberId(member.getId())
                .build();

        postLikeJpaRepository.save(postLike);

        return new PostLikeResponse(true);
    }

}
