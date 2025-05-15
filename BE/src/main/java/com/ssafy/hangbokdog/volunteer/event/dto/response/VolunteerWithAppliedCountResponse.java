package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

public record VolunteerWithAppliedCountResponse(
        Long id,
        String title,
        String content,
        String address,
        String addressName,
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl,
        int appliedCount
) {
    public static VolunteerWithAppliedCountResponse of(
            Long id,
            String title,
            String content,
            String address,
            String addressName,
            LocalDate startDate,
            LocalDate endDate,
            String imageUrl,
            int appliedCount
    ) {
        return new VolunteerWithAppliedCountResponse(
                id,
                title,
                content,
                address,
                addressName,
                startDate,
                endDate,
                imageUrl,
                appliedCount
        );
    }
}
