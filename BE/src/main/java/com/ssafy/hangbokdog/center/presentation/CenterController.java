package com.ssafy.hangbokdog.center.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.center.application.CenterService;
import com.ssafy.hangbokdog.center.application.DonationAccountService;
import com.ssafy.hangbokdog.center.dto.request.CenterCreateRequest;
import com.ssafy.hangbokdog.center.dto.response.DonationAccountBalanceResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/centers")
@RequiredArgsConstructor
public class CenterController {

	private final CenterService centerService;
	private final DonationAccountService donationAccountService;

	@PostMapping
	public ResponseEntity<Void> addCenter(
		@AdminMember Member member,
		@RequestBody CenterCreateRequest request
	) {
		Long centerId = centerService.createCenter(request);
		return ResponseEntity.created(URI.create("/api/v1/centers/" + centerId))
			.build();
	}

	@GetMapping("/{centerId}/balance")
	public ResponseEntity<DonationAccountBalanceResponse> getBalance(
		@AdminMember Member member,
		@PathVariable Long centerId
	) {
		return ResponseEntity.ok().body(donationAccountService.getBalance(centerId));
	}
}
