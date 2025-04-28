package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;

public interface VolunteerSlotJpaRepository extends JpaRepository<VolunteerSlot, Long> {
}
