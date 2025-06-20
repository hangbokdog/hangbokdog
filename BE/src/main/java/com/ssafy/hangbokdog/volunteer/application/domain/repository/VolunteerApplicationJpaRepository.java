package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    List<VolunteerApplication> findByVolunteerId(Long slotId);

    @Modifying
    @Query("DELETE FROM VolunteerApplication va WHERE va.volunteerEventId = :eventId")
    void deleteAllByEventId(Long eventId);

    @Modifying
    @Query("DELETE FROM VolunteerApplication va WHERE va.status = 'PENDING' AND va.volunteerId in :volunteerEventIds")
    void deleteAllExpireApplication(List<Long> volunteerEventIds);

    @Modifying
    @Query(value = """
        UPDATE volunteer_application va
          JOIN volunteer_slot vs ON va.volunteer_slot_id = vs.volunteer_slot_id
           SET va.status = 'COMPLETED'
         WHERE va.status = 'APPROVED'
           AND vs.volunteer_date < CURRENT_DATE()
        """, nativeQuery = true)
    void updatePassedApplicationToComplete();
}
