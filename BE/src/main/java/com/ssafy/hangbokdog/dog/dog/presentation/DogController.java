package com.ssafy.hangbokdog.dog.dog.presentation;

import java.net.URI;
import java.time.LocalDateTime;
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
import com.ssafy.hangbokdog.dog.dog.application.DogService;
import com.ssafy.hangbokdog.dog.dog.application.FavoriteDogService;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dog.dto.request.MedicalHistoryRequest;
import com.ssafy.hangbokdog.dog.dog.dto.request.MedicalHistoryUpdateRequest;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogCreateResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogSearchResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.HospitalDogResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.LocationDogCountResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.MedicalHistoryResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.ProtectedDogCountResponse;
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
	public ResponseEntity<DogCreateResponse> addDog(
		@AuthMember Member member,
		@RequestPart(value = "request") DogCreateRequest request,
		@RequestPart(value = "image") MultipartFile image
	) {

		String imageUrl = uploadImageToS3(image);

		DogCreateResponse response = dogService.createDog(
			member.getId(),
			request,
			imageUrl
		);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/{dogId}")
	public ResponseEntity<DogDetailResponse> getDogDetail(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestParam(name  = "centerId") Long centerId
	) {
		return ResponseEntity.ok(dogService.getDogDetail(dogId, centerId, member.getId()));
	}

	@PatchMapping("/{dogId}/star")
	public ResponseEntity<Void> dogToStar(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestParam Long centerId
	) {
		dogService.dogToStar(dogId, member.getId(), centerId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping(value = "/{dogId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> updateDog(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestPart(value = "request") DogUpdateRequest request,
		@RequestPart(value = "image", required = false) MultipartFile image,
		@RequestParam Long centerId
	) {
		String newImageUrl = (image != null) ? uploadImageToS3(image) : null;

		dogService.updateDog(
			member.getId(),
			centerId,
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

	@PostMapping(value = "/{dogId}/medical-history", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addMedicalHistory(
		@AuthMember Member member,
		@PathVariable(name = "dogId") Long dogId,
		@RequestParam Long centerId,
		@RequestPart(value = "request") MedicalHistoryRequest request,
		@RequestPart(value = "image", required = false) MultipartFile image
	) {
		String imageUrl = (image != null) ? uploadImageToS3(image) : null;

		Long medicalHistoryId = dogService.addMedicalHistory(
			member.getId(),
			centerId,
			request,
			imageUrl,
			dogId
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/" + dogId + "/medical-history" + medicalHistoryId))
			.build();
	}

	@PatchMapping(value = "/{medicalHistoryId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> updateMedicalHistory(
			@AuthMember Member member,
			@PathVariable(name = "medicalHistoryId") Long medicalHistoryId,
			@RequestPart(value = "request") MedicalHistoryUpdateRequest request,
			@RequestPart(value = "image", required = false) MultipartFile image,
			@RequestParam Long centerId
	) {
		String newImageUrl = (image != null) ? uploadImageToS3(image) : null;
		dogService.updateMedicalHistory(
				member.getId(),
				centerId,
				medicalHistoryId,
				newImageUrl,
				request
		);
		return ResponseEntity.noContent().build();
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
		@AuthMember Member member,
		@RequestParam(name = "medicalHistoryId") Long medicalHistoryId,
		@RequestParam Long centerId
	) {
		dogService.deleteMedicalHistory(
			member.getId(),
			centerId,
			medicalHistoryId
		);
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

	@GetMapping("/dogCount")
	public ResponseEntity<ProtectedDogCountResponse> dogCount(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		ProtectedDogCountResponse response = dogService.getDogCount(centerId, member.getId());

		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/search")
	public ResponseEntity<PageInfo<DogSearchResponse>> search(
		@AuthMember Member member,
		@RequestParam(value = "name", required = false) String name,
		@RequestParam(value = "breed", required = false) List<DogBreed> breeds,
		@RequestParam(value = "gender", required = false) Gender gender,
		@RequestParam(value = "start", required = false) LocalDateTime start,
		@RequestParam(value = "end", required = false) LocalDateTime end,
		@RequestParam(value = "isNeutered", required = false) Boolean isNeutered,
		@RequestParam(value = "locationId", required = false) List<Long> locationIds,
		@RequestParam(value = "isStar", required = false) Boolean isStar,
		@RequestParam(value = "centerId") Long centerId,
		@RequestParam(value = "status", required = false) DogStatus status,
		@RequestParam(required = false) String pageToken
	) {
		PageInfo<DogSearchResponse> response = dogService.searchDogs(
			member.getId(),
			name,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			locationIds,
			isStar,
			centerId,
			status,
			pageToken
		);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/location/{locationId}/count")
	public ResponseEntity<LocationDogCountResponse> locationDogCount(@PathVariable Long locationId) {
		return ResponseEntity.ok().body(dogService.getLocationDogCount(locationId));
	}

	@GetMapping("/hospital")
	public ResponseEntity<PageInfo<HospitalDogResponse>> getHospitalDogs(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok().body(dogService.getHospitalDogs(centerId, pageToken));
	}

	private String uploadImageToS3(MultipartFile image) {
		return s3Service.uploadFile(image);
	}
}
