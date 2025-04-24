package com.ssafy.hangbokdog.mileage.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.mileage.application.MileageService;
import com.ssafy.hangbokdog.payment.application.PaymentService;
import com.ssafy.hangbokdog.payment.dto.request.PaymentRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mileages")
public class MileageController {

    private final MileageService mileageService;
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Void> charge(
            @AuthMember Member member,
            @RequestBody PaymentRequest paymentRequest
    ) {
        paymentService.save(paymentRequest);
        mileageService.charge(member, paymentRequest.amount());
        return ResponseEntity.noContent().build();
    }
}
