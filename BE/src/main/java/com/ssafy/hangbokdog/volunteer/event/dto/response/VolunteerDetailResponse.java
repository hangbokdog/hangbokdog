package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.domain.LocationType;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;

import lombok.Builder;

@Builder
public record VolunteerDetailResponse(
        Long id,
        VolunteerEventStatus status,
        String title,
        String content,
        String address,
        LocationType locationType,
        LocalDate startDate,
        LocalDate endDate,
        List<SlotDto> slots,
        List<String> imageUrls,
        String activityLog,
        List<DailyApplicationInfo> applicationInfo,
        String precaution,
        String info
) {
}
