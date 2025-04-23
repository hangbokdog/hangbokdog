package com.ssafy.hangbokdog.post.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.application.CommentService;
import com.ssafy.hangbokdog.post.dto.request.CommentCreateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Void> create(
            @AuthMember Member member,
            @PathVariable Long postId,
            @RequestBody CommentCreateRequest request
    ) {
        Long commentId = commentService.save(member, postId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/posts/{postId}/comments/{commentId}")
                .buildAndExpand(postId, commentId)
                .toUri();

        return ResponseEntity.created(uri).build();
    }
}
