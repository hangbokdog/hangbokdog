package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventRepository {

    private final VolunteerEventJpaRepository volunteerEventJpaRepository;

    public VolunteerEvent save(VolunteerEvent event) {
        return volunteerEventJpaRepository.save(event);
    }

    public List<VolunteerInfo> findAllOpenEvents(Long centerId) {
        return volunteerEventJpaRepository.findAllOpenEvents(centerId);
    }

    public Optional<VolunteerEvent> findById(Long eventId) {
        return volunteerEventJpaRepository.findById(eventId);
    }

    public List<DailyApplicationInfo> findDailyApplications(Long eventId) {
        return volunteerEventJpaRepository.findDailyApplications(eventId);
    }

    public List<VolunteerInfo> findLatestVolunteerEvent(Long centerId) {
        return volunteerEventJpaRepository.findLatestVolunteerEvent(centerId);
    }
}
