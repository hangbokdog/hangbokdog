package com.ssafy.hangbokdog.post.post.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.ssafy.hangbokdog.post.post.application.PostLikeService;
import com.ssafy.hangbokdog.post.post.application.PostService;
import com.ssafy.hangbokdog.post.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.post.dto.request.PostUpdateRequest;
import com.ssafy.hangbokdog.post.post.dto.response.PostLikeResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostLikeService postLikeService;
    private final S3Service s3Service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> create(
            @AuthMember Member member,
            @RequestPart(value = "request") PostCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        List<MultipartFile> images = (files != null ? files : List.of());
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
        PostResponse response = postService.findByPostId(postId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping(path = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> update(
            @AuthMember Member member,
            @PathVariable Long postId,
            @RequestPart(value = "request") PostUpdateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        List<MultipartFile> images = (files != null ? files : List.of());
        List<String> imageUrls = s3Service.uploadFiles(images);

        postService.update(member, postId,  request, imageUrls);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(
            @AuthMember Member member,
            @PathVariable Long postId
    ) {
        postService.delete(member, postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostLikeResponse> toggleLike(
            @AuthMember Member member,
            @PathVariable Long postId
    ) {
        PostLikeResponse response = postLikeService.toggleLike(postId, member);
        return ResponseEntity.ok(response);
    }
}
