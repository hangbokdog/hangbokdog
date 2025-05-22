package com.ssafy.hangbokdog.volunteer.event.domain;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VolunteerSlot extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_slot_id")
    private Long id;

    @Column(name = "volunteer_event_id", nullable = false)
    private Long eventId;

    @Column(name = "volunteer_date", nullable = false)
    private LocalDate volunteerDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false)
    private SlotType slotType;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private int capacity;

    @Column(name = "applicant_count", nullable = false)
    private int appliedCount;

    @Builder
    public VolunteerSlot(
            Long eventId,
            LocalDate volunteerDate,
            SlotType slotType,
            LocalTime startTime,
            LocalTime endTime,
            int capacity
    ) {
        this.eventId = eventId;
        this.volunteerDate = volunteerDate;
        this.slotType = slotType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.capacity = capacity;
        this.appliedCount = 0;
    }

    public void increaseAppliedCount(int headcount) {
        this.appliedCount += headcount;
    }

    public void decreaseAppliedCount() {
        this.appliedCount--;
    }
}
