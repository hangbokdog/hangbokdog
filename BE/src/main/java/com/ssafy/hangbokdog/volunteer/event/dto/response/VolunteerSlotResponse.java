package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;

public record VolunteerSlotResponse(
        Long id,
        SlotType slotType,
        LocalTime startTime,
        LocalTime endTime,
        LocalDate volunteerDate,
        int capacity,
        int applicationCount
) {
}
