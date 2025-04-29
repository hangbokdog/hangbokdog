package com.ssafy.hangbokdog.member.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.application.MemberService;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/search")
    public ResponseEntity<List<MemberSearchNicknameResponse>> findByNickname(
            @AuthMember Member member,
            @RequestParam String nickname
    ) {
        List<MemberSearchNicknameResponse> responses = memberService.findByNickname(nickname);
        return ResponseEntity.ok(responses);
    }
}
