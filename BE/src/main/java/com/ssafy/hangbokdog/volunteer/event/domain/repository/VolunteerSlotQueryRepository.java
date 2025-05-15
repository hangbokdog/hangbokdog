package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponse;

public interface VolunteerSlotQueryRepository {
    List<SlotDto> findByEventId(Long eventId);

    List<VolunteerSlotResponse> findAllByEventIdWithApprovedStatus(Long eventId);

    Integer getAppliedCountByVolunteerIdsIn(List<Long> volunteerEventIds);

    List<VolunteerAppliedCount> getAppliedCountByVolunteerIdsInWithGroupByVolunteerId(List<Long> volunteerEventIds);

    List<VolunteerSlotResponse> findAllByEventIdWithPendingState(Long eventId);
}
