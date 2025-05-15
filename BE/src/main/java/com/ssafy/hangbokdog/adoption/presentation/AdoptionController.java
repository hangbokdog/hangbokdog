package com.ssafy.hangbokdog.adoption.presentation;

import org.geolatte.geom.M;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.adoption.application.AdoptionService;
import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptedDogDetailResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionCreateResponse;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/adoptions")
@RequiredArgsConstructor
public class AdoptionController {

	private final AdoptionService adoptionService;

	@PostMapping
	public ResponseEntity<AdoptionCreateResponse> applyAdoption(
		@AuthMember Member member,
		@RequestParam Long dogId
	) {
		return ResponseEntity.ok().body(adoptionService.applyAdoption(member.getId(), dogId));
	}

	@PatchMapping("/{adoptionId}")
	public ResponseEntity<Void> manageAdoptionApplication(
		@AuthMember Member member,
		@PathVariable Long adoptionId,
		@RequestParam AdoptionStatus request,
		@RequestParam Long centerId
	) {
		adoptionService.manageAdoption(member.getId(), adoptionId, centerId, request);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<PageInfo<AdoptionApplicationResponse>> getAdoptionApplications(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptionApplicationsByCenterId(
			member.getId(),
			centerId,
			pageToken)
		);
	}

	@GetMapping("/adopted/{dogId}")
	public ResponseEntity<AdoptedDogDetailResponse> getAdoptedDogDetails(
		@AuthMember Member member,
		@PathVariable Long dogId
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptedDogDetail(member, dogId));
	}
}
