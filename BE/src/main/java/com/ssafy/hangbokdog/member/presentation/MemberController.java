package com.ssafy.hangbokdog.member.presentation;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.dto.MaskRequest;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.application.MemberService;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.request.FcmTokenUpdateRequest;
import com.ssafy.hangbokdog.member.dto.request.MemberUpdateRequest;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final S3Service s3Service;

    @GetMapping("/search")
    public ResponseEntity<MemberSearchNicknameResponse> findByNickname(
            @AuthMember Member member,
            @RequestParam String nickname
    ) {
        // disableMasking=false 로 넘기면 항상 마스킹
        return ResponseEntity.ok(memberService.findByNickname(new MaskRequest(false), nickname));
    }

    @GetMapping
    public ResponseEntity<PageInfo<MemberResponse>> findMembersInCenter(
            @RequestParam Long centerId,
            @AuthMember Member member,
            @RequestParam(required = false) String pageToken
    ) {
        return ResponseEntity.ok(memberService.findMembersInCenter(centerId, member, pageToken));
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

    @PatchMapping(path = "/my", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateMyProfile(
        @AuthMember Member member,
        @RequestPart(value = "request") MemberUpdateRequest request,
        @RequestPart(value = "files", required = false) MultipartFile file
    ) {
        String imageUrl = null;
        if (file != null) {
            imageUrl = s3Service.uploadFile(file);
        }
        memberService.updateProfile(member.getId(), request, imageUrl);
        return ResponseEntity.noContent().build();
    }
}
