package com.ssafy.hangbokdog.adoption.presentation;

import java.time.LocalDateTime;
import java.util.List;

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
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionCreateResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionDogCountResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionSearchResponse;
import com.ssafy.hangbokdog.adoption.dto.response.MyAdoptionResponse;
import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
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
	public ResponseEntity<List<AdoptionApplicationResponse>> getAdoptionApplications(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptionApplicationsByCenterId(member.getId(), centerId));
	}

	@GetMapping("/{dogId}/applications")
	public ResponseEntity<List<AdoptionApplicationByDogResponse>> getAdoptionApplicationsByDog(
		@AuthMember Member member,
		@PathVariable Long dogId,
		@RequestParam Long centerId,
		@RequestParam(required = false) String name

	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptionApplicationsByDogId(
			member.getId(),
			centerId,
			dogId,
			name
		));
	}

	@GetMapping("/adopted/{dogId}")
	public ResponseEntity<AdoptedDogDetailResponse> getAdoptedDogDetails(
		@AuthMember Member member,
		@PathVariable Long dogId
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptedDogDetail(member, dogId));
	}

	@GetMapping("/appliesCount")
	public ResponseEntity<AdoptionDogCountResponse> getAppliesCountOfDogs(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptionApplyDogCount(member.getId(), centerId));
	}

	@GetMapping("/adoptedCount")
	public ResponseEntity<AdoptionDogCountResponse> getAdoptedDogCount(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(adoptionService.getAdoptedDogCount(member.getId(), centerId));
	}

	@GetMapping("/search")
	public ResponseEntity<PageInfo<AdoptionSearchResponse>> search(
		@AuthMember Member member,
		@RequestParam(value = "name", required = false) String name,
		@RequestParam(value = "centerId") Long centerId,
		@RequestParam(value = "breed", required = false) List<DogBreed> breeds,
		@RequestParam(value = "gender", required = false) Gender gender,
		@RequestParam(value = "start", required = false) LocalDateTime start,
		@RequestParam(value = "end", required = false) LocalDateTime end,
		@RequestParam(value = "isNeutered", required = false) Boolean isNeutered,
		@RequestParam(value = "isStar", required = false) Boolean isStar,
		@RequestParam(required = false) String pageToken
	) {
		return ResponseEntity.ok().body(adoptionService.search(
			member.getId(),
			name,
			centerId,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			isStar,
			pageToken
		));
	}

	@GetMapping("/my")
	public ResponseEntity<List<MyAdoptionResponse>> getMyAdoptions(
		@AuthMember Member member,
		@RequestParam Long centerId
	) {
		return ResponseEntity.ok().body(adoptionService.getMyAdoptions(
			member.getId(),
			centerId
		));
	}
}
