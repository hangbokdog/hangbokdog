package com.ssafy.hangbokdog.post.scrap.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.scrap.domain.Scrap;
import com.ssafy.hangbokdog.post.scrap.domain.repository.ScrapJpaRepository;
import com.ssafy.hangbokdog.post.scrap.dto.response.ScrapResponse;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final ScrapJpaRepository scrapJpaRepository;
    private final PostRepository postRepository;

    @Transactional
    public ScrapResponse toggleScrap(Long postId, Member member) {
        postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        boolean exists = scrapJpaRepository.existsByPostIdAndMemberId(postId, member.getId());

        if (exists) {
            scrapJpaRepository.deleteByPostIdAndMemberId(postId, member.getId());
            return new ScrapResponse(false);
        }

        Scrap scrap = Scrap.builder()
                .postId(postId)
                .memberId(member.getId())
                .build();

        scrapJpaRepository.save(scrap);

        return new ScrapResponse(true);
    }
}
