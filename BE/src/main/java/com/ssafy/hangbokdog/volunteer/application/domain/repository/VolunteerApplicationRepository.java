package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.dto.VolunteerApplicationStatusInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.MemberApplicationInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerSlotAppliedCount;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerApplicationRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final VolunteerApplicationJpaRepository volunteerApplicationJpaRepository;
    private final VolunteerApplicationJdbcRepository volunteerApplicationJdbcRepository;

    public List<VolunteerApplication> saveAll(List<VolunteerApplication> applications) {
        return volunteerApplicationJpaRepository.saveAll(applications);
    }

    public List<WeeklyApplicationResponse> findByMemberIdAndParticipationDateBetween(
            Long memberId, LocalDate weekStart, LocalDate weekEnd
    ) {
        return volunteerApplicationJpaRepository
                .findByMemberIdAndParticipationDateBetween(memberId, weekStart, weekEnd);
    }

    public Optional<VolunteerApplication> findById(Long applicationId) {
        return volunteerApplicationJpaRepository.findById(applicationId);
    }

    public void delete(VolunteerApplication application) {
        volunteerApplicationJpaRepository.delete(application);
    }

    public PageInfo<ApplicationResponse> findAllWithPage(
            Long volunteerEventId,
            VolunteerApplicationStatus status,
            String pageToken
    ) {
        var data = volunteerApplicationJpaRepository.findAll(volunteerEventId, status, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, ApplicationResponse::id);
    }

    public List<VolunteerApplication> findByVolunteerSlotIdIn(List<Long> volunteerSlotIds) {
        return volunteerApplicationJpaRepository.findByVolunteerSlotIdIn(volunteerSlotIds);
    }

    public List<VolunteerApplicationStatusInfo> findByEventIdsIn(Long memberId, List<Long> volunteerIds) {
        return volunteerApplicationJpaRepository.findByEventIdsIn(memberId, volunteerIds);
    }

    public List<VolunteerApplication> findByEventIdAndMemberId(Long eventId, Long memberId) {
        return volunteerApplicationJpaRepository.findByEventIdAndMemberId(eventId, memberId);
    }

    public List<ApplicationResponse> findAll(Long slotId, VolunteerApplicationStatus status) {
        return volunteerApplicationJpaRepository.findByVolunteerId(slotId, status);
    }

    public List<VolunteerSlotAppliedCount> findSlotsWithAppliedCountByIdIn(List<Long> volunteerSlotIds) {
        return volunteerApplicationJpaRepository.findSlotsWithAppliedCountByIdIn(volunteerSlotIds);
    }

    public void deleteByEventId(Long eventId) {
        volunteerApplicationJpaRepository.deleteAllByEventId(eventId);
    }

    public void deleteAllExpireApplication(List<Long> volunteerEventIds) {
        volunteerApplicationJpaRepository.deleteAllExpireApplication(volunteerEventIds);
    }

    public void updatePassedApplicationToComplete() {
        volunteerApplicationJpaRepository.updatePassedApplicationToComplete();
    }

    public List<MemberApplicationInfo> findAllMyApplications(Long memberId, VolunteerApplicationStatus status) {
        return volunteerApplicationJpaRepository.findAllMyApplications(memberId, status);
    }

    public int getTotalCompletedApplicationCountByVolunteerEventIdsIn(List<Long> volunteerEventIds) {
        return volunteerApplicationJpaRepository
                .getTotalCompletedApplicationCountByVolunteerEventIdsIn(
                        volunteerEventIds
                );
    }
}
