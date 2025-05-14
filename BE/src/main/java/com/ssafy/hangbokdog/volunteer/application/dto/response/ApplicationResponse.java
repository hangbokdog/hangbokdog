package com.ssafy.hangbokdog.volunteer.application.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.hangbokdog.member.domain.Grade;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;

public record ApplicationResponse(
        Long id,
        Long memberId,
        Long volunteerId,
        VolunteerApplicationStatus status,
        LocalDateTime createdAt,
        String name,
        String nickname,
        LocalDate birth,
        String phone,
        int age,
        Grade grade,
        String email,
        String profileImage
) {
}
