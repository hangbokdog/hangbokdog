package com.ssafy.hangbokdog.dog.presentation;

import java.net.URI;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.dog.application.DogService;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.image.application.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/dogs")
@RequiredArgsConstructor
public class DogController {

	private final DogService dogService;
	private final S3Service s3Service;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Long> addDog(
		@RequestPart(value = "request") DogCreateRequest request,
		@RequestPart(value = "image") MultipartFile image
	) {

		//TODO: 관리자만 할 수 있게
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

	@PatchMapping("/{dogId}")
	public ResponseEntity<Void> dogToStar(@PathVariable(name = "dogId") Long dogId) {
		dogService.dogToStar(dogId);
		return ResponseEntity.noContent().build();
	}

	private String uploadImageToS3(MultipartFile image) {
		return s3Service.uploadFile(image);
	}
}
