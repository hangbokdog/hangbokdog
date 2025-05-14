package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record VolunteerResponseWithStatus(
        Long id,
        String title,
        String content,
        String address,
        String addressName,
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl,
        VolunteerApplicationStatus status
) {
    public static VolunteerResponseWithStatus of(
            Long id,
            String title,
            String content,
            String address,
            String addressName,
            LocalDate startDate,
            LocalDate endDate,
            String imageUrl,
            VolunteerApplicationStatus status
    ) {
        return new VolunteerResponseWithStatus(
                id,
                title,
                content,
                address,
                addressName,
                startDate,
                endDate,
                imageUrl,
                status
        );
    }
}
