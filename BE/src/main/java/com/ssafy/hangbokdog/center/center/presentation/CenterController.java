package com.ssafy.hangbokdog.center.center.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.center.center.application.CenterService;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.dto.request.CenterCreateRequest;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterSearchResponse;
import com.ssafy.hangbokdog.center.center.dto.response.ExistingCityResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;
import com.ssafy.hangbokdog.center.donationaccount.application.DonationAccountService;
import com.ssafy.hangbokdog.center.donationaccount.dto.response.DonationAccountBalanceResponse;
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
		@AuthMember Member member,
		@RequestBody CenterCreateRequest request
	) {
		Long centerId = centerService.createCenter(member, request);
		return ResponseEntity.created(URI.create("/api/v1/centers/" + centerId))
			.build();
	}

	@GetMapping("/{centerId}/balance")
	public ResponseEntity<DonationAccountBalanceResponse> getBalance(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		return ResponseEntity.ok().body(donationAccountService.getBalance(member.getId(), centerId));
	}

	@PostMapping("/{centerId}/join-request")
	public ResponseEntity<CenterJoinResponse> join(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		return ResponseEntity.ok().body(centerService.join(member, centerId));
	}

	@GetMapping
	public ResponseEntity<List<MyCenterResponse>> getMyCenters(
		@AuthMember Member member
	) {
		List<MyCenterResponse> myCenters = centerService.getMyCenters(member.getId());
		return ResponseEntity.ok().body(myCenters);
	}

	@GetMapping("/search")
	public ResponseEntity<List<CenterSearchResponse>> search(
		@AuthMember Member member,
		@RequestParam(required = false) String name,
		@RequestParam(required = false) CenterCity centerCity
	) {
		List<CenterSearchResponse> response = centerService.searchCenters(
			member.getId(),
			name,
			centerCity
		);

		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/existing-cities")
	public ResponseEntity<List<ExistingCityResponse>> getExistingCities() {
		List<ExistingCityResponse> response = centerService.getExistingCity();
		return ResponseEntity.ok().body(response);
	}

	@DeleteMapping("/{centerId}")
	public ResponseEntity<Void> deleteCenterMember(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		centerService.deleteCenterMember(member.getId(), centerId);
		return ResponseEntity.ok().build();
	}

	@PatchMapping("/{centerId}/main")
	public ResponseEntity<Void> updateMain(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		centerService.registerMainCenter(member.getId(), centerId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{centerId}/main/cancel")
	public ResponseEntity<Void> cancelMain(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		centerService.cancelMainCenter(member.getId(), centerId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/main")
	public ResponseEntity<Long> getMain(@AuthMember Member member) {
		return ResponseEntity.ok().body(centerService.getMainCenter(member.getId()));
	}
}
