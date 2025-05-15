package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalTime;

import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;

public record VolunteerSlotResponse(
        Long id,
        SlotType slotType,
        LocalTime startTime,
        LocalTime endTime,
        int capacity,
        int applicationCount
) {
}
