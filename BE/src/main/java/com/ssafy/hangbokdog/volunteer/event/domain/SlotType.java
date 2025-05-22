package com.ssafy.hangbokdog.volunteer.event.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum SlotType {
    MORNING,
    AFTERNOON,
    FULL_DAY
}
