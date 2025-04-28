package com.ssafy.hangbokdog.sponsorship.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.sponsorship.application.SponsorshipService;

import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
import com.ssafy.hangbokdog.sponsorship.dto.response.SponsorshipResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SponsorshipController {

	private final SponsorshipService sponsorshipService;

	@PostMapping("/dogs/{dogId}/apply-sponsor")
	public ResponseEntity<Void> applySponsorship(
		@AuthMember Member member,
		@PathVariable Long dogId
	) {
		Long sponsorshipId = sponsorshipService.applySponsorship(member.getId(), dogId);

		return ResponseEntity.created(URI.create("/api/v1/dogs/" + sponsorshipId)).build();
	}

	@PatchMapping("/sponsorship/{sponsorshipId}")
	public ResponseEntity<Void> updateSponsorship(
		@AuthMember Member member,
		@PathVariable(name = "sponsorshipId") Long sponsorshipId
	) {
		sponsorshipService.cancelSponsorship(member.getId(), sponsorshipId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/sponsorship/management/{sponsorshipId}")
	public ResponseEntity<Void> manageSponsorship(
		@AdminMember Member member,
		@PathVariable Long sponsorshipId,
		@RequestParam SponsorShipStatus request
	) {
		sponsorshipService.manageSponsorship(sponsorshipId, request);

		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/sponsorship/proceed")
	public ResponseEntity<SponsorshipResponse> proceedSponsorship() {
		SponsorshipResponse response = sponsorshipService.proceedSponsorship();
		return ResponseEntity.ok().body(response);
	}
}
