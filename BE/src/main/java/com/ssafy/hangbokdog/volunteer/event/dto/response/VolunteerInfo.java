package com.ssafy.hangbokdog.volunteer.event.dto.response;

import java.time.LocalDate;
import java.util.List;

// 접수중인 봉사 활동 목록 조회
public record VolunteerInfo(
        Long id,
        String title,
        String content,
        String address,
        String addressName,
        LocalDate startDate,
        LocalDate endDate,
        List<String> imageUrls
) {
}
