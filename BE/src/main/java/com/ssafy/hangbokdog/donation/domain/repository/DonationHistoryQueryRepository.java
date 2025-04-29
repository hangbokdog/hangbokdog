package com.ssafy.hangbokdog.donation.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;

public interface DonationHistoryQueryRepository {
    List<DonationHistoryResponse> findAllByDonorId(
        Long donorId,
        Long centerId,
        String pageToken,
        int pageSize
    );
}
