package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerIdInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

public interface VolunteerEventQueryRepository {
    List<VolunteerInfo> findAllOpenEvents(Long centerId);

    List<VolunteerInfo> findLatestVolunteerEvent(Long centerId);

    List<VolunteerInfo> findAllClosedEvents(Long centerId, String pageToken, int pageSize);

    List<VolunteerInfo> findAllOpenEventsInAddressBook(Long addressBookId);

    List<VolunteerInfo> findAllClosedEventsInAddressBook(Long addressBookId, String pageToken, int pageSize);

    List<VolunteerIdInfo> findActiveEventIds(List<Long> addressBookIds);
}
