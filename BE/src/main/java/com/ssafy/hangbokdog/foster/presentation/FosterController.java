package com.ssafy.hangbokdog.foster.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.foster.application.FosterService;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FosterController {

	private final FosterService fosterService;

	@PostMapping("/dogs/{dogId}/foster")
	public ResponseEntity<Void> applyFoster(
		@AuthMember Member member,
		@PathVariable Long dogId
	) {
		Long fosterId = fosterService.applyFoster(
			member.getId(),
			dogId
		);

		return ResponseEntity.created(URI.create("/api/v1/dogs/foster" + fosterId))
			.build();
	}

	@PatchMapping("/foster/{fosterId}/accept")
	public ResponseEntity<Void> acceptFoster(
		@AdminMember Member member,
		@PathVariable Long fosterId
	) {
		fosterService.acceptFoster(fosterId);

		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/foster/{fosterId}/reject")
	public ResponseEntity<Void> rejectFoster(
		@AdminMember Member member,
		@PathVariable Long fosterId
	) {
		fosterService.rejectFoster(fosterId);

		return ResponseEntity.noContent().build();
	}
}
