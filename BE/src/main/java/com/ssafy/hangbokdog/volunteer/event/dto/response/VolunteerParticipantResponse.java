package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record VolunteerParticipantResponse(
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
    public static VolunteerParticipantResponse of(
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
        return new VolunteerParticipantResponse(
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
