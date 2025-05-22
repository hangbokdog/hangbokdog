package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerIdInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final VolunteerEventJpaRepository volunteerEventJpaRepository;
    private final VolunteerEventJdbcRepository volunteerEventJdbcRepository;

    public VolunteerEvent save(VolunteerEvent event) {
        return volunteerEventJpaRepository.save(event);
    }

    public List<VolunteerInfo> findAllOpenEvents(Long centerId) {
        return volunteerEventJpaRepository.findAllOpenEvents(centerId);
    }

    public Optional<VolunteerEvent> findById(Long eventId) {
        return volunteerEventJpaRepository.findById(eventId);
    }

    public boolean existsById(Long eventId) {
        return volunteerEventJpaRepository.existsById(eventId);
    }

    public List<VolunteerInfo> findLatestVolunteerEvent(Long centerId) {
        return volunteerEventJpaRepository.findLatestVolunteerEvent(centerId);
    }

    public PageInfo<VolunteerResponse> findEndedVolunteerEvent(Long centerId, String pageToken) {
        var data = volunteerEventJpaRepository.findAllClosedEvents(centerId, pageToken, DEFAULT_PAGE_SIZE)
                .stream()
                .map(volunteerInfo -> VolunteerResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().get(0)))
                .toList();

        return PageInfo.of(data, DEFAULT_PAGE_SIZE, VolunteerResponse::endDate, VolunteerResponse::id);
    }

    public List<VolunteerInfo> findAllOpenEventsInAddressBook(Long addressBookId) {
        return volunteerEventJpaRepository.findAllOpenEventsInAddressBook(addressBookId);
    }

    public PageInfo<VolunteerResponse> findEndedVolunteerEventInAddressBook(Long addressBookId, String pageToken) {
        var data = volunteerEventJpaRepository
                .findAllClosedEventsInAddressBook(addressBookId, pageToken, DEFAULT_PAGE_SIZE)
                .stream()
                .map(volunteerInfo -> VolunteerResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().get(0)))
                .toList();

        return PageInfo.of(data, DEFAULT_PAGE_SIZE, VolunteerResponse::endDate, VolunteerResponse::id);
    }

    public List<VolunteerIdInfo> findActiveEventIds(List<Long> addressBookIds) {
        return volunteerEventJpaRepository.findActiveEventIds(addressBookIds);
    }

    public void deleteById(Long eventId) {
        volunteerEventJpaRepository.deleteById(eventId);
    }

    public List<VolunteerEvent> findAllOpenAndPassedEvent() {
        return volunteerEventJpaRepository.findAllOpenAndPassedEvent();
    }

    public void updateToExpiredStatus(List<Long> volunteerEventIds) {
        volunteerEventJdbcRepository.updateExpiredStatusInIds(volunteerEventIds);
    }
}
