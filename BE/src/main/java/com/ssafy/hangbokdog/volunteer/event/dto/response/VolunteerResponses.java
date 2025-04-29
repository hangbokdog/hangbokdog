package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;

import com.ssafy.hangbokdog.volunteer.event.domain.LocationType;

// 접수중인 봉사 활동 목록 조회
public record VolunteerResponses(
        Long id,
        String title,
        String content,
        String address,
        LocationType locationType,
        LocalDate startDate,
        LocalDate endDate
) {
}
