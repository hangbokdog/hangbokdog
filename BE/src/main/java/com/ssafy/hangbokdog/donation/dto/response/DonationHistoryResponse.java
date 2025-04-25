package com.ssafy.hangbokdog.donation.dto.response;

import java.time.LocalDateTime;

import com.ssafy.hangbokdog.donation.domain.DonationType;

public record DonationHistoryResponse(
        Long id,
        int amount,
        DonationType donationType,
        LocalDateTime createdAt
) {
}
