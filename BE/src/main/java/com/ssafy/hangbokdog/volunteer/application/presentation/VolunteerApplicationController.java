package com.ssafy.hangbokdog.volunteer.application.presentation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.application.application.VolunteerApplicationService;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest;
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
        volunteerApplicationService.apply(member, eventId, request);
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
}
