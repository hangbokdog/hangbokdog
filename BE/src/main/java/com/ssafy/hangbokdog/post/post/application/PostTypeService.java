package com.ssafy.hangbokdog.post.post.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.post.post.domain.PostType;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.post.domain.repository.PostTypeJpaRepository;
import com.ssafy.hangbokdog.post.post.dto.request.PostTypeRequest;
import com.ssafy.hangbokdog.post.post.dto.response.PostTypeCreateResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostTypeResponse;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostTypeService {

    private final PostTypeJpaRepository postTypeJpaRepository;
    private final PostRepository postRepository;
    private final CenterRepository centerRepository;
    private final CenterMemberRepository centerMemberRepository;

    public PostTypeCreateResponse create(Long memberId, Long centerId, PostTypeRequest request) {

        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        centerRepository.findById(centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_NOT_FOUND));

        if (postTypeJpaRepository.existsByName(request.name(), centerId)) {
            throw new BadRequestException(ErrorCode.POST_TYPE_NAME_EXISTS);
        }

        PostType newPostType = new PostType(request.name(), centerId);

        PostType postType = postTypeJpaRepository.save(newPostType);

        return new PostTypeCreateResponse(postType.getId());
    }

    // TODO: 게시판 페이지네이션 로직 필요하면 추가
    public List<PostTypeResponse> findAll(Long centerId) {
        List<PostType> postTypeList = postTypeJpaRepository.findAllByCenterId(centerId);

        return postTypeList.stream()
                .map(PostTypeResponse::from)
                .toList();
    }

    public PostTypeResponse findById(Long postTypeId) {
        PostType postType = postTypeJpaRepository.findById(postTypeId)
                .orElseThrow(() ->new BadRequestException(ErrorCode.POST_TYPE_NOT_FOUND));

        return PostTypeResponse.from(postType);
    }

    @Transactional
    public void update(Long memberId, Long centerId, Long postTypeId, PostTypeRequest request) {

        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        PostType postType = postTypeJpaRepository.findById(postTypeId)
                .orElseThrow(() ->new BadRequestException(ErrorCode.POST_TYPE_NOT_FOUND));

        postType.update(request.name());
    }

    @Transactional
    public void delete(Long memberId, Long centerId, Long postTypeId) {

        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        PostType postType = postTypeJpaRepository.findById(postTypeId)
                .orElseThrow(() ->new BadRequestException(ErrorCode.POST_TYPE_NOT_FOUND));

        // 게시판 삭제 전, 해당 게시판에 속한 모든 게시글을 먼저 삭제
        postRepository.deleteAllByPostTypeId(postTypeId);

        postTypeJpaRepository.delete(postType);
    }
}
