package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;

public interface VolunteerApplicationQueryRepository {

    List<WeeklyApplicationResponse> findByMemberIdAndParticipationDateBetween(
            Long memberId,
            LocalDate weekStart,
            LocalDate weekEnd
    );

    List<ApplicationResponse> findAll(
            Long volunteerEventId,
            VolunteerApplicationStatus status,
            String pageToken,
            int pageSize
    );
}
