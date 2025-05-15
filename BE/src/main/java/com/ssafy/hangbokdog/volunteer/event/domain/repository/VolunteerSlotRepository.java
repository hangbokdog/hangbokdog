package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerSlotRepository {

    private final VolunteerSlotJpaRepository volunteerSlotJpaRepository;

    public void saveAll(List<VolunteerSlot> volunteerSlots) {
        volunteerSlotJpaRepository.saveAll(volunteerSlots);
    }

    public List<SlotDto> findByEventId(Long eventId) {
        return volunteerSlotJpaRepository.findByEventId(eventId);
    }

    public Optional<VolunteerSlot> findById(Long slotId) {
        return volunteerSlotJpaRepository.findById(slotId);
    }

    public List<VolunteerSlot> findByIdIn(List<Long> volunteerSlotIds) {
        return volunteerSlotJpaRepository.findByIdIn(volunteerSlotIds);
    }

    public List<VolunteerSlotResponse> findAllByEventId(Long eventId) {
        return volunteerSlotJpaRepository.findAllByEventId(eventId);
    }

    public Integer getAppliedCountByVolunteerIdsIn(List<Long> volunteerEventIds) {
        return volunteerSlotJpaRepository.getAppliedCountByVolunteerIdsIn(volunteerEventIds);
    }

    public List<VolunteerAppliedCount> getAppliedCountByVolunteerIdsInWithGroupByVolunteerId(
            List<Long> volunteerEventIds
    ) {
        return volunteerSlotJpaRepository.getAppliedCountByVolunteerIdsInWithGroupByVolunteerId(
                volunteerEventIds
        );
    }
}
