package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

import com.ssafy.hangbokdog.volunteer.event.domain.LocationType;

public record VolunteerResponse(
        Long id,
        String title,
        String content,
        String address,
        LocationType locationType,
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl
) {
    public static VolunteerResponse of(
            Long id,
            String title,
            String content,
            String address,
            LocationType locationType,
            LocalDate startDate,
            LocalDate endDate,
            String imageUrl
    ) {
        return new VolunteerResponse(
                id,
                title,
                content,
                address,
                locationType,
                startDate,
                endDate,
                imageUrl
        );
    }
}
