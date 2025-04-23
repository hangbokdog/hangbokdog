package com.ssafy.hangbokdog.post.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.post.domain.PostType;
import com.ssafy.hangbokdog.post.domain.repository.PostTypeJpaRepository;
import com.ssafy.hangbokdog.post.dto.request.PostTypeRequest;
import com.ssafy.hangbokdog.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostTypeService {

    private final PostTypeJpaRepository postTypeJpaRepository;

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
}
