package com.ssafy.hangbokdog.volunteer.event.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VolunteerTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_template_id")
    private Long id;

    @Column(name = "address_book_id", nullable = false)
    private Long addressBookId;

    @Column(name = "precaution", columnDefinition = "TEXT", nullable = false)
    private String precaution;

    @Column(name = "info", columnDefinition = "TEXT", nullable = false)
    private String info;

    @Builder
    public VolunteerTemplate(
            Long addressBookId,
            String precaution,
            String info
    ) {
        this.addressBookId = addressBookId;
        this.precaution = precaution;
        this.info = info;
    }

    public void updateInfo(String info) {
        this.info = info;
    }

    public void updatePrecaution(String precaution) {
        this.precaution = precaution;
    }
}
