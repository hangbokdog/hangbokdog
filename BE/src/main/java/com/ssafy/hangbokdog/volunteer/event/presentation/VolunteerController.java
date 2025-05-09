package com.ssafy.hangbokdog.volunteer.event.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.event.application.VolunteerService;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerDetailResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final S3Service s3Service;


    @PostMapping
    public ResponseEntity<Void> create(
        @AuthMember Member member,
        @RequestParam Long centerId,
        @RequestBody VolunteerCreateRequest request
    ) {
        Long eventId = volunteerService.create(member.getId(), centerId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/volunteers/{id}")
                .buildAndExpand(eventId)
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    // 활동 일지에서의 이미지 업로드
    @PostMapping("/images")
    public ResponseEntity<String> uploadImageInActivityLog(
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        String imageUrl = s3Service.uploadFile(file);
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping
    public ResponseEntity<List<VolunteerResponse>> findAll(
            @AuthMember Member member,
            @RequestParam(required = false) Long centerId
    ) {
        List<VolunteerResponse> responses = volunteerService.findAll(centerId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<VolunteerDetailResponse> findById(
            @AuthMember Member member,
            @PathVariable Long eventId
    ) {
        VolunteerDetailResponse response = volunteerService.findById(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<VolunteerResponse>> findLatest(
            @AuthMember Member member,
            @RequestParam(required = false) Long centerId
    ) {
        return ResponseEntity.ok(volunteerService.findLatest(centerId));
    }

    @GetMapping("/ended")
    public ResponseEntity<PageInfo<VolunteerResponse>> findEnded(
            @AuthMember Member member,
            @RequestParam(required = false) String pageToken,
            @RequestParam Long centerId
    ) {
        return ResponseEntity.ok(volunteerService.findEnded(centerId, pageToken));
    }

    @GetMapping("/{addressBookId}/addressBooks")
    public ResponseEntity<List<VolunteerResponse>> findOngoingVolunteersInAddressBook(
            @AuthMember Member member,
            @PathVariable Long addressBookId
    ) {
        return ResponseEntity.ok(volunteerService.findOngoingVolunteersInAddressBook(addressBookId));
    }

    @GetMapping("/{addressBookId}/addressBooks/ended")
    public ResponseEntity<PageInfo<VolunteerResponse>> findendedVolunteerInAddressBook(
            @AuthMember Member member,
            @RequestParam(required = false) String pageToken,
            @PathVariable Long addressBookId
    ) {
        return ResponseEntity.ok(volunteerService.findEndedVolunteersInAddressBook(addressBookId, pageToken));
    }
}
