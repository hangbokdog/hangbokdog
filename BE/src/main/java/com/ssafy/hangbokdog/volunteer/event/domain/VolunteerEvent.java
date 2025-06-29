package com.ssafy.hangbokdog.volunteer.event.domain;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VolunteerEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_event_id")
    private Long id;

    @Column(nullable = false)
    private Long centerId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> imageUrls;     // 활동 일지에서 추출한 이미지들

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "address_name", nullable = false)
    private String addressName;

    @Column(name = "address_book_id", nullable = false)
    private Long addressBookId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "activity_log", nullable = false, columnDefinition = "text")
    private String activityLog;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String precaution;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String info;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VolunteerEventStatus status;

    @Builder
    public VolunteerEvent(
            Long centerId,
            String title,
            String content,
            List<String> imageUrls,
            String address,
            LocalDate startDate,
            LocalDate endDate,
            String activityLog,
            String precaution,
            String info,
            Long addressBookId,
            String addressName
    ) {
        this.content = "";
        this.centerId = centerId;
        this.title = title;
        this.content = content;
        this.imageUrls = imageUrls;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityLog = activityLog;
        this.precaution = precaution;
        this.info = info;
        this.status = VolunteerEventStatus.OPEN;
        this.addressBookId = addressBookId;
        this.addressName = addressName;
    }

    public void update(
            String activityLog,
            String info,
            String content,
            String precaution,
            String title
    ) {
        this.activityLog = activityLog;
        this.info = info;
        this.content = content;
        this.precaution = precaution;
        this.title = title;
    }
}
