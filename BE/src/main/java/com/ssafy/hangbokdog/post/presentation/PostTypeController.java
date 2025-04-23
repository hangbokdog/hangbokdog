package com.ssafy.hangbokdog.post.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.application.PostTypeService;
import com.ssafy.hangbokdog.post.dto.request.PostTypeRequest;
import com.ssafy.hangbokdog.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/post-type")
@RequiredArgsConstructor
public class PostTypeController {

    private final PostTypeService postTypeService;

    @PostMapping
    public ResponseEntity<Void> create(
            @AdminMember Member admin,
            @RequestBody PostTypeRequest request) {
        Long postTypeId = postTypeService.create(request);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/post-type/{id}")
                .buildAndExpand(postTypeId)
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<List<PostTypeResponse>> getList() {
        List<PostTypeResponse> postTypeList = postTypeService.findAll();
        return ResponseEntity.ok(postTypeList);
    }
}
