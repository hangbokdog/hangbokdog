package com.ssafy.hangbokdog.member.presentation;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.dto.MaskRequest;
import com.ssafy.hangbokdog.member.application.MemberService;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.request.FcmTokenUpdateRequest;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/search")
    public ResponseEntity<MemberSearchNicknameResponse> findByNickname(
            @AuthMember Member member,
            @RequestParam String nickname
    ) {
        // disableMasking=false 로 넘기면 항상 마스킹
        return ResponseEntity.ok(memberService.findByNickname(new MaskRequest(false), nickname));
    }

    @PatchMapping("/fcm-token")
    public ResponseEntity<Void> saveFcmToken(
        @AuthMember Member member,
        @RequestBody @Valid FcmTokenUpdateRequest request
    ) {
        memberService.saveFcmToken(member.getId(), request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/fcm-token")
    public ResponseEntity<Void> deleteFcmToken(
        @AuthMember Member member
    ) {
        memberService.deleteFcmToken(member.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<MemberProfileResponse> getMyProfile(@AuthMember Member member) {
        return ResponseEntity.ok().body(memberService.getMemberProfile(member.getId()));
    }
}
