package com.ssafy.hangbokdog.volunteer.application.dto;

public record VolunteerSlotCapacity(
        int capacity,
        int appliedCount
) {
    public static VolunteerSlotCapacity of(
            int capacity,
            int appliedCount
    ) {
        return new VolunteerSlotCapacity(
                capacity,
                appliedCount
        );
    }
}
