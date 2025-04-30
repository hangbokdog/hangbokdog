package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;

public interface VolunteerApplicationQueryRepository {

    List<WeeklyApplicationResponse> findByMemberIdAndParticipationDateBetween(
            Long memberId,
            LocalDate weekStart,
            LocalDate weekEnd
    );
}
