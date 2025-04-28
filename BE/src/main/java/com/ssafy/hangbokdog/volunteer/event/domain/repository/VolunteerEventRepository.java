package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventRepository {

    private final VolunteerEventJpaRepository volunteerEventJpaRepository;

    public VolunteerEvent save(VolunteerEvent event) {
        return volunteerEventJpaRepository.save(event);
    }
}
