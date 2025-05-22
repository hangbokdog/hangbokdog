package com.ssafy.hangbokdog.center.center.domain;

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
public class CenterJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_join_request")
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "center_id", nullable = false)
    private Long centerId;

    public boolean isAuthor(Long memberId) {
        return this.memberId.equals(memberId);
    }

    @Builder
    public CenterJoinRequest(
            Long memberId,
            Long centerId
    ) {
        this.memberId = memberId;
        this.centerId = centerId;
    }
}
