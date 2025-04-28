package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;

public interface VolunteerEventJpaRepository extends JpaRepository<VolunteerEvent, Long> {
}
