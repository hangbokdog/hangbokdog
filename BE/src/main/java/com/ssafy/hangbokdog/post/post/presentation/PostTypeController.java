package com.ssafy.hangbokdog.post.post.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.post.application.PostTypeService;
import com.ssafy.hangbokdog.post.post.dto.request.PostTypeRequest;
import com.ssafy.hangbokdog.post.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/post-types")
@RequiredArgsConstructor
public class PostTypeController {

    private final PostTypeService postTypeService;

    @PostMapping
    public ResponseEntity<Void> create(
            @AuthMember Member member,
            @RequestParam Long centerId,
            @RequestBody PostTypeRequest request
    ) {
        Long postTypeId = postTypeService.create(member.getId(), centerId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/post-types/{id}")
                .buildAndExpand(postTypeId)
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<List<PostTypeResponse>> getAll(
            @AuthMember Member member,
            @RequestParam(required = false) Long centerId
    ) {
        List<PostTypeResponse> responses = postTypeService.findAll(centerId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{postTypeId}")
    public ResponseEntity<PostTypeResponse> get(
            @AuthMember Member member,
            @PathVariable Long postTypeId
    ) {
        PostTypeResponse response = postTypeService.findById(postTypeId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{postTypeId}")
    public ResponseEntity<Void> update(
            @AuthMember Member member,
            @RequestParam Long centerId,
            @PathVariable Long postTypeId,
            @RequestBody PostTypeRequest request) {
        postTypeService.update(member.getId(), centerId, postTypeId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postTypeId}")
    public ResponseEntity<Void> delete(
            @AuthMember Member member,
            @RequestParam Long centerId,
            @PathVariable Long postTypeId
    ) {
        postTypeService.delete(member.getId(), centerId, postTypeId);
        return ResponseEntity.noContent().build();
    }
}
