package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

public record DailyApplicationInfo(
        LocalDate date,
        SlotCapacity morning,
        SlotCapacity afternoon
) {
    public record SlotCapacity(
            int appliedCount,  // 신청된 인원 수
            int capacity       // 총 정원
    ) {

    }
}
