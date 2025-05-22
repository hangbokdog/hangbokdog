package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

public record DailyApplicationInfo(
        LocalDate date,
        SlotCapacity morning,
        SlotCapacity afternoon
) {
    public record SlotCapacity(
            Long volunteerSlotId,
            int appliedCount,  // 신청된 인원 수
            int capacity       // 총 정원
    ) {
        public static SlotCapacity of(
                Long volunteerSlotId,
                int appliedCount,
                int capacity
        ) {
            return new SlotCapacity(volunteerSlotId, appliedCount, capacity);
        }
    }

    public static DailyApplicationInfo of(
            LocalDate date,
            SlotCapacity morning,
            SlotCapacity afternoon
    ) {
        return new DailyApplicationInfo(date, morning, afternoon);
    }
}
