package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus;

import lombok.Builder;

@Builder
public record VolunteerDetailResponse(
        Long id,
        VolunteerEventStatus status,
        String title,
        String content,
        String address,
        String addressName,
        LocalDate startDate,
        LocalDate endDate,
        List<VolunteerSlotResponse> slots,
        List<String> imageUrls,
        String activityLog,
        String precaution,
        String info
) {
}
