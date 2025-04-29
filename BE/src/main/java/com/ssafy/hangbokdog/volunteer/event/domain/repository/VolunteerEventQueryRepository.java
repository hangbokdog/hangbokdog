package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponses;

public interface VolunteerEventQueryRepository {
    List<VolunteerResponses> findAllOpenEvents(Long centerId);

    List<DailyApplicationInfo> findDailyApplications(Long eventId);
}
