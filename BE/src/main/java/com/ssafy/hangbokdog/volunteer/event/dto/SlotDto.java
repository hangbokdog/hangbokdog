package com.ssafy.hangbokdog.volunteer.event.dto;

import java.time.LocalTime;

import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;

public record SlotDto(
        SlotType slotType,
        LocalTime startTime,
        LocalTime endTime,
        int capacity
) {
}
