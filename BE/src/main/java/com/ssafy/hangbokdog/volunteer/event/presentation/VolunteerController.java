package com.ssafy.hangbokdog.volunteer.event.presentation;

import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
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
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplateInfoUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplatePrecautionUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerDetailResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplateInfoResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplatePrecautionResponse;

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

    @GetMapping("/{eventId}/schedule")
    public ResponseEntity<List<DailyApplicationInfo>> findAllSchedule(
            @AuthMember Member member,
            @PathVariable Long eventId
    ) {
        return ResponseEntity.ok(volunteerService.findAllSchedule(eventId));
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
    public ResponseEntity<PageInfo<VolunteerResponse>> findEndedVolunteerInAddressBook(
            @AuthMember Member member,
            @RequestParam(required = false) String pageToken,
            @PathVariable Long addressBookId
    ) {
        return ResponseEntity.ok(volunteerService.findEndedVolunteersInAddressBook(addressBookId, pageToken));
    }

    @PostMapping("/{addressBookId}/volunteerTemplates/info")
    public ResponseEntity<Void> updateVolunteerTemplateInfo(
            @AuthMember Member member,
            @PathVariable Long addressBookId,
            @RequestParam Long centerId,
            @RequestBody VolunteerTemplateInfoUpdateRequest request
    ) {
        volunteerService.updateTemplateInfo(member, addressBookId, request, centerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{addressBookId}/volunteerTemplates/precaution")
    public ResponseEntity<Void> updateVolunteerTemplate(
            @AuthMember Member member,
            @PathVariable Long addressBookId,
            @RequestParam Long centerId,
            @RequestBody VolunteerTemplatePrecautionUpdateRequest request
    ) {
        volunteerService.updateTemplatePrecaution(member, addressBookId, request, centerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{addressBookId}/volunteerTemplates/info")
    public ResponseEntity<VolunteerTemplateInfoResponse> findVolunteerTemplateInfo(
            @AuthMember Member member,
            @PathVariable Long addressBookId,
            @RequestParam Long centerId
    ) {
        return ResponseEntity.ok(volunteerService.findVolunteerTemplateInfo(
                member,
                addressBookId,
                centerId)
        );
    }

    @GetMapping("/{addressBookId}/volunteerTemplates/precaution")
    public ResponseEntity<VolunteerTemplatePrecautionResponse> findVolunteerTemplatePrecaution(
        @AuthMember Member member,
        @PathVariable Long addressBookId,
        @RequestParam Long centerId
    ) {
        return ResponseEntity.ok(volunteerService.findVolunteerTemplatePrecaution(
            member,
            addressBookId,
            centerId)
        );
    }
}
