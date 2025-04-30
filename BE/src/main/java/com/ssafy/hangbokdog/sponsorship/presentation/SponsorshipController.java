package com.ssafy.hangbokdog.sponsorship.presentation;

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
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.sponsorship.application.SponsorshipService;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
import com.ssafy.hangbokdog.sponsorship.dto.response.FailedSponsorshipResponse;
import com.ssafy.hangbokdog.sponsorship.dto.response.MySponsorshipResponse;

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
	public ResponseEntity<Void> cancelSponsorship(
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

	@GetMapping("/sponsorship/failed")
	public ResponseEntity<List<FailedSponsorshipResponse>> getFailedSponsorships(
		@AuthMember Member member
	) {
		List<FailedSponsorshipResponse> response = sponsorshipService.getFailedSponsorships(member);
		return ResponseEntity.ok().body(response);
	}

	@PatchMapping("/sponsorship/{sponsorshipId}/pay")
	public ResponseEntity<Void> paySponsorship(
		@AuthMember Member member,
		@PathVariable Long sponsorshipId
	) {
		sponsorshipService.payFailedSponsorship(member, sponsorshipId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/sponsorship/my")
	public ResponseEntity<List<MySponsorshipResponse>> getMySponsorships(@AuthMember Member member) {
		List<MySponsorshipResponse> response = sponsorshipService.getMySponsorships(member);
		return ResponseEntity.ok().body(response);
	}
}
