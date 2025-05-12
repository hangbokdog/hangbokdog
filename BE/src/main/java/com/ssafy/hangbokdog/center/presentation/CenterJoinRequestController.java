package com.ssafy.hangbokdog.center.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.center.application.CenterService;
import com.ssafy.hangbokdog.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.dto.response.CenterJoinRequestResponse;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/centerJoinRequests")
public class CenterJoinRequestController {

    private final CenterService centerService;

    @PostMapping("/{centerJoinRequestId}/approve")
    public ResponseEntity<Void> approve(
            @AuthMember Member member,
            @PathVariable Long centerJoinRequestId
    ) {
        centerService.approve(member, centerJoinRequestId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{centerJoinRequestId}/reject")
    public ResponseEntity<Void> reject(
        @AuthMember Member member,
        @PathVariable Long centerJoinRequestId
    ) {
        centerService.reject(member, centerJoinRequestId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{centerId}")
    public ResponseEntity<PageInfo<CenterJoinRequestResponse>> findAll(
            @AuthMember Member member,
            @PathVariable Long centerId,
            @RequestParam(required = false) String pageToken
    ) {

        return ResponseEntity.ok(centerService.findAll(member, centerId, pageToken));
    }

    @GetMapping
    public ResponseEntity<List<AppliedCenterResponse>> getAppliedCenters(@AuthMember Member member) {
        return ResponseEntity.ok(centerService.getAppliedCenters(member.getId()));
    }

    @DeleteMapping("/{centerJoinRequestId}")
    public ResponseEntity<Void> delete(@AuthMember Member member, @PathVariable Long centerJoinRequestId) {
        centerService.deleteCenterJoinRequest(member.getId(), centerJoinRequestId);
        return ResponseEntity.noContent().build();
    }
}
