package com.ssafy.hangbokdog.volunteer.application.presentation;

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
import com.ssafy.hangbokdog.volunteer.application.application.VolunteerApplicationService;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest;

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
}
