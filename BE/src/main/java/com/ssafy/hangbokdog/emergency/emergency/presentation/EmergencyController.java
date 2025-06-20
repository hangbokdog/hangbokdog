package com.ssafy.hangbokdog.emergency.emergency.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.emergency.emergency.application.EmergencyService;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyDonationRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyTransportRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyVolunteerRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyCreateResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyLatestResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.RecruitedEmergencyResponse;
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

	@GetMapping
	public ResponseEntity<List<EmergencyResponse>> getEmergenciesByCenterId(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@RequestParam(required = false) EmergencyType type
	) {
		return ResponseEntity.ok().body(emergencyService.getEmergencyByCenter(centerId, type, member.getId()));
	}

	@GetMapping("/latest")
	public ResponseEntity<EmergencyLatestResponse> getLatestEmergenciesByCenterId(
			@AuthMember Member member,
			@RequestParam Long centerId,
			@RequestParam(required = false) EmergencyType type
	) {
		return ResponseEntity.ok().body(emergencyService.getLatestEmergencyByCenter(
			member.getId(),
			centerId,
			type
		));
	}

	@DeleteMapping("/{emergencyId}")
	private ResponseEntity<Void> deleteEmergency(
		@AuthMember Member member,
		@PathVariable Long emergencyId,
		@RequestParam Long centerId
	) {
		emergencyService.deleteEmergency(emergencyId, centerId, member.getId());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/recruited")
	public ResponseEntity<List<RecruitedEmergencyResponse>> getRecruitedEmergencies(
			@AuthMember Member member,
			@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyService.getRecruitedEmergencies(member.getId(), centerId));
	}
}
