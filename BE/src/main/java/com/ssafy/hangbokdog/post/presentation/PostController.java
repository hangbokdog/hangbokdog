package com.ssafy.hangbokdog.post.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.application.PostService;
import com.ssafy.hangbokdog.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.dto.response.PostResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final S3Service s3Service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> create(
            @AuthMember Member member,
            @RequestPart(value = "request") PostCreateRequest request,
            @RequestPart(value = "files") List<MultipartFile> images
    ) {
        List<String> imageUrls = s3Service.uploadFiles(images);
        Long postId = postService.create(member, request, imageUrls);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/posts/{id}")
                .buildAndExpand(postId)
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<PageInfo<PostResponse>> getAll(
            @AuthMember Member member,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        PageInfo<PostResponse> responses = postService.findAll(pageToken);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> get(@PathVariable Long postId) {
        PostResponse response = postService.findById(postId);
        return ResponseEntity.ok(response);
    }
}
