package com.ssafy.hangbokdog.volunteer.event.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.domain.LocationType;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;

// TODO: 필요 시, 활동 일지 API 분리
public record VolunteerCreateRequest(
        String title,
        String content,
        String address,
        LocationType locationType,
        LocalDate startDate,
        LocalDate endDate,
        String activityLog,
        String precaution,
        String info,
        List<SlotDto> slots
) {
}