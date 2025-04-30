package com.ssafy.hangbokdog.center.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AdminMember;
import com.ssafy.hangbokdog.center.application.DonationAccountService;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/donationAccount")
@RequiredArgsConstructor
public class DonationAccountController {

	private final DonationAccountService donationAccountService;

	// @PatchMapping
	// public ResponseEntity<Void> applyTransactionsToDonationAccount(
	// 	@AdminMember Member member
	// ) {
	// 	donationAccountService.applyTransactionsToDonationAccount();
	// 	return ResponseEntity.noContent().build();
	// }
}
