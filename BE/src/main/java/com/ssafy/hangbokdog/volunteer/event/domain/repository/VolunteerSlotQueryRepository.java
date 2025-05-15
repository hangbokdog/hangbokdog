package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponse;

public interface VolunteerSlotQueryRepository {
    List<SlotDto> findByEventId(Long eventId);

    List<VolunteerSlotResponse> findAllByEventId(Long eventId);
}
