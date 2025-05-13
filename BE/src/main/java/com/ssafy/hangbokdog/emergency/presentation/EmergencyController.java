package com.ssafy.hangbokdog.emergency.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.emergency.application.EmergencyService;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyDonationRequest;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyTransportRequest;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyVolunteerRequest;
import com.ssafy.hangbokdog.emergency.dto.response.EmergencyCreateResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyController {

	private final EmergencyService emergencyService;

	@PostMapping("/transport")
	public ResponseEntity<EmergencyCreateResponse> createTransportEmergency(
		@AuthMember Member member,
		@RequestBody EmergencyTransportRequest request,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyService.createTransPortEmergency(request, member, centerId));
	}

	@PostMapping("/volunteer")
	public ResponseEntity<EmergencyCreateResponse> createVolunteerEmergency(
		@AuthMember Member member,
		@RequestBody EmergencyVolunteerRequest request,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyService.createVolunteerEmergency(request, member, centerId));
	}

	@PostMapping("/donation")
	public ResponseEntity<EmergencyCreateResponse> createDonationEmergency(
		@AuthMember Member member,
		@RequestBody EmergencyDonationRequest request,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyService.createDonationEmergency(request, member, centerId));
	}
}
