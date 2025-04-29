package com.ssafy.hangbokdog.volunteer.application.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VolunteerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_event_id")
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "volunteer_slot_id", nullable = false)
    private Long volunteerId;

    @Column(name = "participation_date", nullable = false)
    private LocalDate participationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VolunteerApplicationStatus status;
}
