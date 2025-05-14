package com.ssafy.hangbokdog.vaccination.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.vaccination.application.VaccinationService;
import com.ssafy.hangbokdog.vaccination.dto.request.VaccinationCompleteRequest;
import com.ssafy.hangbokdog.vaccination.dto.request.VaccinationCreateRequest;
import com.ssafy.hangbokdog.vaccination.dto.response.SavedDogCountResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationCreateResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDetailResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationSummaryResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/vaccinations")
@RequiredArgsConstructor
public class VaccinationController {

	private final VaccinationService vaccinationService;

	@PostMapping
	public ResponseEntity<VaccinationCreateResponse> createVaccination(
		@AuthMember Member member,
		@RequestBody VaccinationCreateRequest request,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok(vaccinationService.createVaccination(centerId, member.getId(), request));
	}

	@PatchMapping("/{vaccinationId}")
	public ResponseEntity<Void> completeVaccination(
		@AuthMember Member member,
		@PathVariable Long vaccinationId,
		@RequestParam Long centerId,
		@RequestBody VaccinationCompleteRequest request
	) {
		vaccinationService.completeVaccination(centerId, member.getId(), vaccinationId, request);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{vaccinationId}")
	public ResponseEntity<SavedDogCountResponse> saveVaccination(
		@AuthMember Member member,
		@PathVariable Long vaccinationId,
		@RequestParam Long centerId,
		@RequestBody VaccinationCompleteRequest request
	) {
		return ResponseEntity.ok().body(vaccinationService.saveVaccination(
			centerId,
			member.getId(),
			vaccinationId,
			request
		));
	}

	@GetMapping("/{vaccinationId}")
	public ResponseEntity<VaccinationDetailResponse> getVaccinationDetail(
		@AuthMember Member member,
		@PathVariable Long vaccinationId
	) {
		return ResponseEntity.ok(vaccinationService.getVaccinationDetail(vaccinationId));
	}

	@GetMapping
	public ResponseEntity<PageInfo<VaccinationSummaryResponse>> getVaccinationSummaries(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok(vaccinationService.getVaccinationSummaries(centerId, pageToken));
	}

	@GetMapping("/{vaccinationId}/done")
	public ResponseEntity<PageInfo<VaccinationDoneResponse>> getVaccinatedDogs(
		@AuthMember Member member,
		@RequestParam(required = false) String pageToken,
		@PathVariable Long vaccinationId
	) {
		return ResponseEntity.ok().body(vaccinationService.getVaccinatedDogs(vaccinationId, pageToken));
	}

	@GetMapping("/{vaccinationId}/yet")
	public ResponseEntity<PageInfo<VaccinationDoneResponse>> getNotYetVaccinatedDogs(
		@AuthMember Member member,
		@RequestParam(required = false) String pageToken,
		@PathVariable Long vaccinationId
	) {
		return ResponseEntity.ok().body(vaccinationService.getNotVaccinatedDogs(vaccinationId, pageToken));
	}
}
