package com.ssafy.hangbokdog.volunteer.event.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum LocationType {
    REST_YARD,      // 쉼뜰
    SHELTER,        // 쉼터
    ADOPTION_YARD   // 입양뜰
}
