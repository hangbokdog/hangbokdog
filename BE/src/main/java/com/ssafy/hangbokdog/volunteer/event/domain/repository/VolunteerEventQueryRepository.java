package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

public interface VolunteerEventQueryRepository {
    List<VolunteerInfo> findAllOpenEvents(Long centerId);

    List<DailyApplicationInfo> findDailyApplications(Long eventId);
}
