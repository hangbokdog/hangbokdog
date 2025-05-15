package com.ssafy.hangbokdog.post.announcement.presentation;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.announcement.application.AnnouncementService;
import com.ssafy.hangbokdog.post.announcement.dto.request.AnnouncementCreateRequest;
import com.ssafy.hangbokdog.post.announcement.dto.request.AnnouncementUpdateRequest;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementCreateResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementDetailResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

	private final AnnouncementService announcementService;
	private final S3Service s3Service;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<AnnouncementCreateResponse> saveAnnouncement(
		@AuthMember Member member,
		@RequestPart(value = "request") AnnouncementCreateRequest request,
		@RequestPart(value = "files", required = false) List<MultipartFile> files,
		@RequestParam Long centerId
	) {
		List<MultipartFile> images = (files != null ? files : List.of());
		List<String> imageUrls = s3Service.uploadFiles(images);

		return ResponseEntity.ok().body(announcementService.saveAnnouncement(
			member,
			centerId,
			request,
			imageUrls
		));
	}

	@GetMapping
	public ResponseEntity<PageInfo<AnnouncementResponse>> getAll(
		@AuthMember Member member,
		@RequestParam(required = false, name = "pageToken") String pageToken,
		@RequestParam Long centerId
	) {
		PageInfo<AnnouncementResponse> responses = announcementService.findAll(centerId, pageToken);
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{announcementId}")
	public ResponseEntity<AnnouncementDetailResponse> getAnnouncement(
		@AuthMember Member member,
		@PathVariable Long announcementId,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(announcementService.getDetail(member.getId(), centerId, announcementId));
	}

	@PatchMapping(path = "/{announcementId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> update(
		@AuthMember Member member,
		@PathVariable Long announcementId,
		@RequestPart(value = "request") AnnouncementUpdateRequest request,
		@RequestPart(value = "files", required = false) List<MultipartFile> files
	) {
		List<MultipartFile> images = (files != null ? files : List.of());
		List<String> imageUrls = s3Service.uploadFiles(images);

		announcementService.update(member, announcementId, request, imageUrls);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{announcementId}")
	public ResponseEntity<Void> delete(
		@AuthMember Member member,
		@PathVariable Long announcementId
	) {
		announcementService.delete(member, announcementId);
		return ResponseEntity.noContent().build();
	}
}
