package com.ssafy.hangbokdog.post.scrap.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.scrap.application.ScrapService;
import com.ssafy.hangbokdog.post.scrap.dto.response.ScrapResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapService scrapService;

    @PostMapping("/{postId}/scrap")
    public ResponseEntity<ScrapResponse> toggleScrap(
            @AuthMember Member member,
            @PathVariable Long postId
    ) {
        ScrapResponse response = scrapService.toggleScrap(postId, member);
        return ResponseEntity.ok(response);
    }
}
