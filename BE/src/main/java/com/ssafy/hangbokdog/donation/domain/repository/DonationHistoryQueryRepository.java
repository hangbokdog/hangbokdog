package com.ssafy.hangbokdog.donation.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.donation.dto.response.DonationAmountResponse;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

public interface DonationHistoryQueryRepository {
    List<DonationHistoryResponse> findAllByDonorId(
        Long donorId,
        Long centerId,
        String pageToken,
        int pageSize
    );

    DonationAmountResponse getDonationAmountByCenterIdAndMemberId(Long centerId, Long memberId);

    Long getMonthlyDonationAmountByCenterId(Long centerId, LocalDateTime monthStart, LocalDateTime monthEnd);
}
