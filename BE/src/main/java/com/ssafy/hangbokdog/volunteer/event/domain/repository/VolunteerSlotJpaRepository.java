package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;

public interface VolunteerSlotJpaRepository extends JpaRepository<VolunteerSlot, Long>, VolunteerSlotQueryRepository {

    @Query("SELECT vs FROM VolunteerSlot vs WHERE vs.id in :volunteerSlotIds")
    List<VolunteerSlot> findByIdIn(List<Long> volunteerSlotIds);
}
