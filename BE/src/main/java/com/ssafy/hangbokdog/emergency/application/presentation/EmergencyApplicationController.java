package com.ssafy.hangbokdog.emergency.application.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.emergency.application.application.EmergencyApplicationService;
import com.ssafy.hangbokdog.emergency.application.dto.response.EmergencyApplicationCreateResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/emergency-applications")
@RequiredArgsConstructor
public class EmergencyApplicationController {

	private final EmergencyApplicationService emergencyApplicationService;

	@PostMapping("/apply/{emergencyId}}")
	public ResponseEntity<EmergencyApplicationCreateResponse> apply(
		@AuthMember Member member,
		@PathVariable Long emergencyId,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok(emergencyApplicationService.apply(member.getId(), centerId, emergencyId));
	}

	@DeleteMapping("/{emergencyApplicationId}")
	public ResponseEntity<Void> delete(
		@AuthMember Member member,
		@PathVariable Long emergencyApplicationId
	) {
		emergencyApplicationService.delete(member.getId(), emergencyApplicationId);
		return ResponseEntity.noContent().build();
	}
}
