package com.ssafy.hangbokdog.donation.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.donation.application.DonationService;
import com.ssafy.hangbokdog.donation.dto.request.DonationRequest;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/donations")
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Void> donate(
            @AuthMember Member member,
            @RequestBody DonationRequest donationRequest
    ) {
        donationService.donate(member, donationRequest);
        return ResponseEntity.noContent().build();
    }
}
