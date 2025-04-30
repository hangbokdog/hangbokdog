package com.ssafy.hangbokdog.volunteer.application.domain;

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
public class VolunteerApplication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_event_id")
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "volunteer_slot_id", nullable = false)
    private Long volunteerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VolunteerApplicationStatus status;

    @Builder
    public VolunteerApplication(Long memberId, Long volunteerId) {
        this.memberId = memberId;
        this.volunteerId = volunteerId;
        this.status = VolunteerApplicationStatus.PENDING;
    }

    public void updateStatus(VolunteerApplicationStatus status) {
        this.status = status;
    }
}
