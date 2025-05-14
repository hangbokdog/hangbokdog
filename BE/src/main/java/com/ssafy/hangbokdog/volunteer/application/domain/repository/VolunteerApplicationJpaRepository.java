package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;

public interface VolunteerApplicationJpaRepository
        extends JpaRepository<VolunteerApplication, Long>, VolunteerApplicationQueryRepository {

    boolean existsByVolunteerIdAndMemberId(Long volunteerId, Long memberId);

    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteerId in :volunteerSlotIds"
            + " AND (va.status = 'PENDING' OR va.status = 'APPROVED')")
    List<VolunteerApplication> findByVolunteerSlotIdIn(List<Long> volunteerSlotIds);

    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteerEventId = :eventId AND va.memberId = :memberId")
    List<VolunteerApplication> findByEventIdAndMemberId(Long eventId, Long memberId);
}
