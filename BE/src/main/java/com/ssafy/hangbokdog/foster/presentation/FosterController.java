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

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.foster.application.FosterService;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.dto.response.FosterDiaryCheckResponse;
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
		@PathVariable Long dogId
	) {
		Long fosterId = fosterService.applyFoster(
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

	@PatchMapping("/fosters/{fosterId}/application")
	public ResponseEntity<Void> decideFosterApplication(
		@AdminMember Member member,
		@PathVariable Long fosterId,
		@RequestParam FosterStatus request
	) {

		fosterService.decideFosterApplication(
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
	public ResponseEntity<List<FosterDiaryCheckResponse>> checkFosterDiaries(@AdminMember Member Member) {
		List<FosterDiaryCheckResponse> response = fosterService.checkFosterDiaries();
		return ResponseEntity.ok().body(response);
	}
}
