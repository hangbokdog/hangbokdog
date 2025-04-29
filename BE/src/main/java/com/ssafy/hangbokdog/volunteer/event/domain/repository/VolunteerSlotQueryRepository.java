package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;

public interface VolunteerSlotQueryRepository {
    List<SlotDto> findByEventId(Long eventId);
}
