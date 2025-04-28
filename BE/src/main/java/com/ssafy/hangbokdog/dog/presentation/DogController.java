package com.ssafy.hangbokdog.dog.presentation;

import java.net.URI;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.application.DogService;
import com.ssafy.hangbokdog.dog.application.FavoriteDogService;
import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dto.request.MedicalHistoryRequest;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dto.response.MedicalHistoryResponse;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/dogs")
@RequiredArgsConstructor
public class DogController {

	private final DogService dogService;
	private final S3Service s3Service;
	private final FavoriteDogService favoriteDogService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addDog(
		@AdminMember Member member,
		@RequestPart(value = "request") DogCreateRequest request,
		@RequestPart(value = "image") MultipartFile image
	) {

		String imageUrl = uploadImageToS3(image);

		Long dogId = dogService.createDog(
			request,
			imageUrl
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/" + dogId))
			.build();
	}

	@GetMapping("/{dogId}")
	public ResponseEntity<DogDetailResponse> getDogDetail(@PathVariable(name = "dogId") Long dogId) {
		return ResponseEntity.ok(dogService.getDogDetail(dogId));
	}

	@PatchMapping("/{dogId}/star")
	public ResponseEntity<Void> dogToStar(
		@AdminMember Member member,
		@PathVariable(name = "dogId") Long dogId
	) {
		dogService.dogToStar(dogId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping(value = "/{dogId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> updateDog(
		@AdminMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestPart(value = "request") DogUpdateRequest request,
		@RequestPart(value = "image", required = false) MultipartFile image
	) {
		String newImageUrl = (image != null) ? uploadImageToS3(image) : null;

		dogService.updateDog(
			request,
			newImageUrl,
			dogId
		);

		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{dogId}/favorite")
	public ResponseEntity<Void> addFavoriteDog(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId
	) {
		Long favoriteDogId = favoriteDogService.addFavoriteDog(
			member,
			dogId
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/favorite" + favoriteDogId))
			.build();
	}

	@DeleteMapping("/{dogId}/favorite")
	public ResponseEntity<Void> removeFavoriteDog(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId
	) {
		favoriteDogService.deleteFavoriteDog(
			member,
			dogId
		);

		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{dogId}/medical-history")
	public ResponseEntity<Void> addMedicalHistory(
		@AdminMember Member member,
		@RequestBody MedicalHistoryRequest request,
		@PathVariable(name = "dogId") Long dogId
	) {
		Long medicalHistoryId = dogService.addMedicalHistory(
			request,
			dogId
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/" + dogId + "/medical-history" + medicalHistoryId))
			.build();
	}

	@GetMapping("/{dogId}/medical-history")
	public ResponseEntity<PageInfo<MedicalHistoryResponse>> getMedicalHistories(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok(dogService.getMedicalHistories(dogId, pageToken));
	}

	@DeleteMapping("/{dogId}/medical-history")
	public ResponseEntity<Void> removeMedicalHistory(
		@AdminMember Member member,
		@RequestParam(name = "medicalHistoryId") Long medicalHistoryId
	) {
		dogService.deleteMedicalHistory(medicalHistoryId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{dogId}/center")
	public ResponseEntity<DogCenterInfo> getDogCenterInfo(
	 	@AuthMember Member member,
		@PathVariable Long dogId
	) {
		DogCenterInfo response = dogService.getDogCenterInfo(dogId);
		return ResponseEntity.ok().body(response);
	}

	private String uploadImageToS3(MultipartFile image) {
		return s3Service.uploadFile(image);
	}
}
