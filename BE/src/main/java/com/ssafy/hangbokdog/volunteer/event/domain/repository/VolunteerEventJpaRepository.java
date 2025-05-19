package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;

public interface VolunteerEventJpaRepository
        extends JpaRepository<VolunteerEvent, Long>, VolunteerEventQueryRepository {

    @Query("SELECT v FROM VolunteerEvent v WHERE v.status = 'OPEN' AND v.endDate < CURRENT_DATE")
    List<VolunteerEvent> findAllOpenAndPassedEvent();
}
