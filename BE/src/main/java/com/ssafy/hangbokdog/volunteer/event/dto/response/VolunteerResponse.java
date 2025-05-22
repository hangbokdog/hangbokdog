package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;


public record VolunteerResponse(
        Long id,
        String title,
        String content,
        String address,
        String addressName,
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl
) {
    public static VolunteerResponse of(
            Long id,
            String title,
            String content,
            String address,
            String addressName,
            LocalDate startDate,
            LocalDate endDate,
            String imageUrl
    ) {
        return new VolunteerResponse(
                id,
                title,
                content,
                address,
                addressName,
                startDate,
                endDate,
                imageUrl
        );
    }
}
