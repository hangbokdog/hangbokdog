package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.dto.VolunteerApplicationStatusInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.MemberApplicationInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerSlotAppliedCount;

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

    List<VolunteerApplicationStatusInfo> findByEventIdsIn(Long memberId, List<Long> volunteerIds);

    List<ApplicationResponse> findByVolunteerId(Long slotId, VolunteerApplicationStatus status);

    List<VolunteerSlotAppliedCount> findSlotsWithAppliedCountByIdIn(List<Long> volunteerSlotIds);

    List<MemberApplicationInfo> findAllMyApplications(Long memberId, VolunteerApplicationStatus status);

    int getTotalCompletedApplicationCountByVolunteerEventIdsIn(List<Long> volunteerEventIds);
}
