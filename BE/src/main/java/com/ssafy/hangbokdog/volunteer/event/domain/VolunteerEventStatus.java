package com.ssafy.hangbokdog.volunteer.event.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum VolunteerEventStatus {
    OPEN,  // 접수중
    CLOSED  // 접수마감
}
