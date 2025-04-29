package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponses;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventRepository {

    private final VolunteerEventJpaRepository volunteerEventJpaRepository;

    public VolunteerEvent save(VolunteerEvent event) {
        return volunteerEventJpaRepository.save(event);
    }

    public List<VolunteerResponses> findAllOpenEvents() {
        return volunteerEventJpaRepository.findAllOpenEvents();
    }

    public Optional<VolunteerEvent> findById(Long eventId) {
        return volunteerEventJpaRepository.findById(eventId);
    }

    public List<DailyApplicationInfo> findAllDailyApplications(Long eventId) {
        return volunteerEventJpaRepository.findDailyApplications(eventId);
    }
}
