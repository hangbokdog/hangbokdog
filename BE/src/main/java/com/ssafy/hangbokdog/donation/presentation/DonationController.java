package com.ssafy.hangbokdog.donation.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.donation.application.DonationService;
import com.ssafy.hangbokdog.donation.dto.request.DonationRequest;
import com.ssafy.hangbokdog.donation.dto.response.DonationAmountResponse;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping("/api/v1/donations")
    public ResponseEntity<Void> donate(
            @AuthMember Member member,
            @RequestParam(name = "centerId") Long centerId,
            @RequestBody DonationRequest donationRequest
    ) {
        donationService.donate(member, centerId, donationRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/v1/donations")
    public ResponseEntity<PageInfo<DonationHistoryResponse>> findAll(
            @AuthMember Member member,
            @RequestParam(required = false, name = "centerId") Long centerId,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        return ResponseEntity.ok(donationService.findAll(member, centerId, pageToken));
    }

    @GetMapping("/api/v1/donations/total")
    public ResponseEntity<DonationAmountResponse> getTotalDonationAmount(
            @RequestParam Long centerId,
            @AuthMember Member member
    ) {
        return ResponseEntity.ok(donationService.getDonationAmount(centerId, member));
    }
}
