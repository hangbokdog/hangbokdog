package com.ssafy.hangbokdog.emergency.application.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.emergency.application.application.EmergencyApplicationService;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.dto.response.AllEmergencyApplicationResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationCreateResponse;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyApplicationController {

	private final EmergencyApplicationService emergencyApplicationService;

	@PostMapping("/{emergencyId}/apply")
	public ResponseEntity<EmergencyApplicationCreateResponse> apply(
		@AuthMember Member member,
		@PathVariable Long emergencyId,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok(emergencyApplicationService.apply(member.getId(), centerId, emergencyId));
	}

	@DeleteMapping("/applications/{emergencyApplicationId}")
	public ResponseEntity<Void> delete(
		@AuthMember Member member,
		@PathVariable Long emergencyApplicationId
	) {
		emergencyApplicationService.delete(member.getId(), emergencyApplicationId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/applications/{emergencyApplicationId}")
	public ResponseEntity<Void> manageEmergencyApplication(
		@AuthMember Member member,
		@PathVariable Long emergencyApplicationId,
		@PathVariable Long emergencyId,
		@RequestParam EmergencyApplicationStatus request,
		@RequestParam Long centerId
	) {
		emergencyApplicationService.manageEmergencyApplication(
			member.getId(),
			centerId,
			emergencyApplicationId,
			emergencyId,
			request
		);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{emergencyId}/applies")
	public ResponseEntity<List<EmergencyApplicationResponse>> getEmergencyApplications(
		@AuthMember Member member,
		@PathVariable Long emergencyId,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyApplicationService.getEmergencyApplications(
			member.getId(),
			centerId,
			emergencyId
		));
	}

	@GetMapping("/applications/my")
	public ResponseEntity<List<EmergencyApplicationResponse>> getMyEmergencyApplications(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyApplicationService.getMyEmergencyApplications(
				member.getId(),
				centerId
		));
	}

	@GetMapping("/applications")
	public ResponseEntity<List<AllEmergencyApplicationResponse>> getApplications(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(emergencyApplicationService.getAllEmergencyApplications(
			member.getId(),
			centerId
		));
	}
}
