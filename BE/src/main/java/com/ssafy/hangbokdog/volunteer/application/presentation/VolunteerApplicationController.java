package com.ssafy.hangbokdog.volunteer.application.presentation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.application.application.VolunteerApplicationService;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationStatusUpdateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerApplicationController {

    private final VolunteerApplicationService volunteerApplicationService;

    @PostMapping("/{eventId}/applications")
    public ResponseEntity<Void> apply(
            @AuthMember Member member,
            @PathVariable Long eventId,
            @RequestBody VolunteerApplicationCreateRequest request
    ) {
        volunteerApplicationService.apply(eventId, request);
        return ResponseEntity.created(null).build();
    }

    @GetMapping("/{eventId}/applications/my")
    public ResponseEntity<List<WeeklyApplicationResponse>> findAllByMe(
            @AuthMember Member member,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<WeeklyApplicationResponse> responses = volunteerApplicationService.getWeeklyApplications(member, date);
        return ResponseEntity.ok(responses);
    }

    // 관리자: PENDING -> APPROVED or REJECTED
    @PatchMapping("/{eventId}/applications/{applicationId}/status")
    public ResponseEntity<Void> updateStatus(
            @AuthMember Member member,
            @PathVariable Long eventId,
            @PathVariable Long applicationId,
            @RequestBody VolunteerApplicationStatusUpdateRequest request
    ) {
        volunteerApplicationService.updateStatus(member.getId(), applicationId, request);
        return ResponseEntity.noContent().build();
    }

    // 유저: 자신의 PENDING 신청 취소
    @DeleteMapping("/{eventId}/applications/{applicationId}/cancel")
    public ResponseEntity<Void> cancel(
            @AuthMember Member member,
            @PathVariable Long eventId,
            @PathVariable Long applicationId
    ) {
        volunteerApplicationService.delete(applicationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/applications")
    public ResponseEntity<PageInfo<ApplicationResponse>> findAll(
            @AuthMember Member member,
            @PathVariable Long eventId,
            @RequestParam VolunteerApplicationStatus status,
            @RequestParam(required = false) String pageToken,
            @RequestParam Long centerId
    ) {
        return ResponseEntity.ok(volunteerApplicationService.findAll(
                member,
                eventId,
                status,
                pageToken,
                centerId
                )
        );
    }
}
