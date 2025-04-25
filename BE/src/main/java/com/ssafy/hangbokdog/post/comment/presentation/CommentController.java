package com.ssafy.hangbokdog.post.comment.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.comment.application.CommentService;
import com.ssafy.hangbokdog.post.comment.dto.CommentCreateRequest;
import com.ssafy.hangbokdog.post.comment.dto.CommentUpdateRequest;

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

    @PatchMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> update(
            @AuthMember Member member,
            @PathVariable("postId") Long postId,
            @PathVariable("commentId") Long commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        commentService.update(member, commentId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> delete(
            @AuthMember Member member,
            @PathVariable("postId") Long postId,
            @PathVariable("commentId") Long commentId
    ) {
        commentService.delete(member, commentId);
        return ResponseEntity.noContent().build();
    }
}
