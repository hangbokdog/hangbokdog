package com.ssafy.hangbokdog.foster.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.foster.application.FosterService;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationByDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterDiaryCheckResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosteredDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FosterController {

	private final FosterService fosterService;

	@PostMapping("/dogs/{dogId}/fosters")
	public ResponseEntity<Void> applyFoster(
		@AuthMember Member member,
		@PathVariable Long dogId,
		@RequestParam Long centerId
	) {
		Long fosterId = fosterService.applyFoster(
				centerId,
			member.getId(),
			dogId
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/fosters" + fosterId))
			.build();
	}

	@PatchMapping("/fosters/{fosterId}/application/cancel")
	public ResponseEntity<Void> cancelFosterApplication(
		@AuthMember Member member,
		@PathVariable Long fosterId
	) {
		fosterService.cancelFosterApplication(member.getId(), fosterId);

		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/fosters/{fosterId}/decide")
	public ResponseEntity<Void> decideFosterApplication(
		@AuthMember Member member,
		@PathVariable Long fosterId,
		@RequestParam FosterStatus request,
		@RequestParam Long centerId
	) {

		fosterService.decideFosterApplication(
				member.getId(),
			centerId,
			fosterId,
			request
		);

		return ResponseEntity.noContent().build();
	}

	@GetMapping("/fosters/my")
	public ResponseEntity<List<MyFosterResponse>> getMyFosters(@AuthMember Member member) {
		List<MyFosterResponse> response = fosterService.getMyFosters(member.getId());
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/fosters/applications/my")
	public ResponseEntity<List<MyFosterResponse>> getMyFosterApplications(@AuthMember Member member) {
		List<MyFosterResponse> response = fosterService.getMyFosterApplications(member.getId());
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/fosters/check-diaries")
	public ResponseEntity<List<FosterDiaryCheckResponse>> checkFosterDiaries(
			@AuthMember Member member,
			@RequestParam Long centerId
	) {
		List<FosterDiaryCheckResponse> response = fosterService.checkFosterDiaries(member.getId(), centerId);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/dogs/fosters/{dogId}")
	public ResponseEntity<List<DogFosterResponse>> getFostersByDogId(
		@AuthMember Member member,
		@PathVariable Long dogId
	) {
		List<DogFosterResponse> response = fosterService.getFostersByDogId(dogId);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/fosters/applications-get")
	public ResponseEntity<List<FosterApplicationResponse>> getFosterApplications(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(fosterService.getFosterApplicationsByCenterId(member.getId(), centerId));
	}

	@GetMapping("/fosters/{dogId}/applications")
	public ResponseEntity<List<FosterApplicationByDogResponse>> getFosterApplicationsByDog(
		@AuthMember Member member,
		@PathVariable Long dogId,
		@RequestParam Long centerId,
		@RequestParam(required = false) String name

	) {
		return ResponseEntity.ok().body(fosterService.getFosterApplicationsByDogId(
			member.getId(),
			centerId,
			dogId,
			name
		));
	}

	@GetMapping("/fosters/fostered")
	public ResponseEntity<List<FosteredDogResponse>> getFosteredDogs(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(fosterService.getFosteredDogs(member.getId(), centerId));
	}
}
