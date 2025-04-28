package com.ssafy.hangbokdog.volunteer.event.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.event.application.VolunteerService;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final S3Service s3Service;


    @PostMapping
    public ResponseEntity<Void> create(
        @AdminMember Member admin,
        @RequestBody VolunteerCreateRequest request
    ) {
        Long eventId = volunteerService.create(request);
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
}
