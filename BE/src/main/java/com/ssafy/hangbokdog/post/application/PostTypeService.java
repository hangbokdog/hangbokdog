package com.ssafy.hangbokdog.post.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.post.domain.PostType;
import com.ssafy.hangbokdog.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.domain.repository.PostTypeJpaRepository;
import com.ssafy.hangbokdog.post.dto.request.PostTypeRequest;
import com.ssafy.hangbokdog.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostTypeService {

    private final PostTypeJpaRepository postTypeJpaRepository;
    private final PostRepository postRepository;

    public Long create(PostTypeRequest request) {
        // TODO: 게시판 이름 중복 검사 로직 필요하면 추가
        PostType newPostType = new PostType(request.name());

        postTypeJpaRepository.save(newPostType);

        return newPostType.getId();
    }

    // TODO: 게시판 페이지네이션 로직 필요하면 추가
    public List<PostTypeResponse> findAll() {
        List<PostType> postTypeList = postTypeJpaRepository.findAll();

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
    public void update(Long postTypeId, PostTypeRequest request) {
        PostType postType = postTypeJpaRepository.findById(postTypeId)
                .orElseThrow(() ->new BadRequestException(ErrorCode.POST_TYPE_NOT_FOUND));

        postType.update(request.name());
    }

    @Transactional
    public void delete(Long postTypeId) {
        PostType postType = postTypeJpaRepository.findById(postTypeId)
                .orElseThrow(() ->new BadRequestException(ErrorCode.POST_TYPE_NOT_FOUND));

        // 게시판 삭제 전, 해당 게시판에 속한 모든 게시글을 먼저 삭제
        postRepository.deleteAllByPostTypeId(postTypeId);

        postTypeJpaRepository.delete(postType);
    }
}
