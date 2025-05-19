package com.ssafy.hangbokdog.volunteer.application.application;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.AGE_REQUIREMENT_NOT_MET;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.DUPLICATE_APPLICATION;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.VOLUNTEER_NOT_FOUND;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.domain.repository.VolunteerApplicationRepository;
import com.ssafy.hangbokdog.volunteer.application.dto.VolunteerSlotCapacity;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest.ApplicationRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationStatusUpdateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.VolunteerApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.event.VolunteerApplicationEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerSlotAppliedCount;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerApplicationService {

    private static final int VOLUNTEER_AGE_RESTRICTION = 20;

    private final VolunteerApplicationRepository volunteerApplicationRepository;
    private final VolunteerEventRepository volunteerEventRepository;
    private final VolunteerSlotRepository volunteerSlotRepository;
    private final MemberRepository memberRepository;
    private final CenterMemberRepository centerMemberRepository;
    private final ApplicationEventPublisher publisher;


    public void apply(Long eventId, VolunteerApplicationCreateRequest request) {
        if (!volunteerEventRepository.existsById(eventId)) {
            throw new BadRequestException(VOLUNTEER_NOT_FOUND);
        }

        List<Long> volunteerSlotIds = extractSlotIds(request);
        List<Long> allParticipantIds = extractAllParticipantIds(request);

        var memberAgeInfo = memberRepository.findByIdInWithAge(allParticipantIds);
        if (memberAgeInfo.stream().anyMatch(info -> info.age() < VOLUNTEER_AGE_RESTRICTION)) {
            throw new BadRequestException(AGE_REQUIREMENT_NOT_MET);
        }

        var volunteerSlots = volunteerSlotRepository.findByIdIn(volunteerSlotIds);
        var slotIdToCapacity = mapSlotIdToCapacity(volunteerSlots);
        var slotIdToSlot = mapSlotIdToSlot(volunteerSlots);

        if (volunteerSlots.size() != request.applications().size()) {
            throw new BadRequestException(ErrorCode.SLOT_NOT_FOUND);
        }

        var slotsAppliedCount = volunteerApplicationRepository.findSlotsWithAppliedCountByIdIn(volunteerSlotIds);
        var slotIdsToAppliedCount = mapSlotIdsToAppliedCount(slotsAppliedCount);

        for (var applicationRequest : request.applications()) {
            VolunteerSlotCapacity slotCapacity = slotIdToCapacity.get(applicationRequest.volunteerSlotId());
            if (slotIdsToAppliedCount.getOrDefault(applicationRequest.volunteerSlotId(), 0)
                    + applicationRequest.participantIds().size() >= slotCapacity.capacity()
            ) {
                throw new BadRequestException(ErrorCode.SLOT_FULL);
            }
        }

        var previousVolunteerApplications = volunteerApplicationRepository.findByVolunteerSlotIdIn(volunteerSlotIds);
        var slotIdToMemberIds = mapSlotIdToMemberIds(previousVolunteerApplications);
        List<VolunteerApplication> volunteerApplications = new ArrayList<>();

        for (var applicationRequest : request.applications()) {
            HashSet<Long> participantMemberIds = slotIdToMemberIds.getOrDefault(
                    applicationRequest.volunteerSlotId(),
                    new HashSet<>()
            );
            VolunteerSlot slot = slotIdToSlot.get(applicationRequest.volunteerSlotId());

            if (slot.getVolunteerDate().isBefore(LocalDate.now())) {
                throw new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_PROCESSING_FAILED);
            }

            slot.increaseAppliedCount(applicationRequest.participantIds().size());

            for (Long participantId : applicationRequest.participantIds()) {
                if (participantMemberIds.contains(participantId)) {
                    throw new BadRequestException(DUPLICATE_APPLICATION);
                }

                volunteerApplications.add(
                        VolunteerApplication.builder()
                                .volunteerSlotId(applicationRequest.volunteerSlotId())
                                .volunteerEventId(eventId)
                                .memberId(participantId)
                                .build()
                );
            }
        }

        volunteerApplicationRepository.saveAll(volunteerApplications);
    }

    public List<WeeklyApplicationResponse> getWeeklyApplications(Member member, LocalDate date) {
        // 1) 이번 주 일요일 ~ 토요일 계산
        LocalDate weekStart = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate weekEnd   = date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        return volunteerApplicationRepository.findByMemberIdAndParticipationDateBetween(
                member.getId(),
                weekStart,
                weekEnd
        );
    }

    @Transactional
    public void updateStatus(
            Long memberId,
            Long applicationId,
            VolunteerApplicationStatusUpdateRequest request,
            Long centerId
    ) {
        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        VolunteerApplication application = volunteerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_NOT_FOUND));

        VolunteerSlot slot = volunteerSlotRepository.findById(application.getVolunteerId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.SLOT_NOT_FOUND));

        VolunteerEvent volunteerEvent = volunteerEventRepository.findById(application.getVolunteerEventId())
                .orElseThrow(() -> new BadRequestException(VOLUNTEER_NOT_FOUND));

        // 신청(이벤트) 날짜가 지났으면 수정 불가
        LocalDate today = LocalDate.now();
        LocalDate eventDate = slot.getVolunteerDate();
        if (eventDate.isBefore(today)) {
            throw new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_PROCESSING_FAILED);
        }

        publisher.publishEvent(
                new VolunteerApplicationEvent(
                        application.getMemberId(),
                        volunteerEvent.getTitle(),
                        request.status()
                        )
        );

        slot.decreaseAppliedCount();
        if (request.status().equals(VolunteerApplicationStatus.REJECTED)) {
            volunteerApplicationRepository.delete(application);
            return;
        }

        application.updateStatus(request.status());

    }

    @Transactional
    public void delete(Long applicationId) {
        VolunteerApplication application = volunteerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_NOT_FOUND));

        VolunteerSlot slot = volunteerSlotRepository.findById(application.getVolunteerId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.SLOT_NOT_FOUND));

        // 신청(이벤트) 날짜가 지났으면 수정 불가
        LocalDate today = LocalDate.now();
        LocalDate eventDate = slot.getVolunteerDate();
        if (eventDate.isBefore(today)) {
            throw new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_PROCESSING_FAILED);
        }

        volunteerApplicationRepository.delete(application);

        slot.decreaseAppliedCount();
    }

    public PageInfo<ApplicationResponse> findAll(
            Member member,
            Long volunteerEventId,
            VolunteerApplicationStatus status,
            String pageToken,
            Long centerId
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        return volunteerApplicationRepository.findAllWithPage(volunteerEventId, status, pageToken);
    }

    public List<ApplicationResponse> findAllBySlotId(Long slotId, Member member, Long centerId) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        return volunteerApplicationRepository.findAll(slotId, VolunteerApplicationStatus.PENDING);
    }

    private Map<Long, HashSet<Long>> mapSlotIdToMemberIds(List<VolunteerApplication> previousVolunteerApplications) {
        return previousVolunteerApplications.stream()
                .collect(Collectors.groupingBy(
                        VolunteerApplication::getVolunteerId,
                        Collectors.mapping(
                                VolunteerApplication::getMemberId,
                                Collectors.toCollection(HashSet::new)
                        )
                ));
    }

    private Map<Long, VolunteerSlotCapacity> mapSlotIdToCapacity(List<VolunteerSlot> volunteerSlots) {
        return volunteerSlots.stream()
                .collect(Collectors.toMap(
                        VolunteerSlot::getId,
                        volunteerSlot -> VolunteerSlotCapacity.of(
                                volunteerSlot.getCapacity(),
                                volunteerSlot.getAppliedCount()
                        )
                ));
    }

    private List<Long> extractAllParticipantIds(VolunteerApplicationCreateRequest request) {
        return request.applications().stream()
                .flatMap(app -> app.participantIds().stream())
                .distinct()
                .toList();
    }

    private List<Long> extractSlotIds(VolunteerApplicationCreateRequest request) {
        return request.applications().stream()
                .map(ApplicationRequest::volunteerSlotId)
                .toList();
    }

    private Map<Long, Integer> mapSlotIdsToAppliedCount(List<VolunteerSlotAppliedCount> slotsAppliedCount) {
        return slotsAppliedCount.stream()
                .collect(Collectors.toMap(
                        VolunteerSlotAppliedCount::volunteerSlotId,
                        VolunteerSlotAppliedCount::count
                ));
    }

    private Map<Long, VolunteerSlot> mapSlotIdToSlot(List<VolunteerSlot> volunteerSlots) {
        return volunteerSlots.stream()
                .collect(Collectors.toMap(
                        VolunteerSlot::getId,
                        volunteerSlot -> volunteerSlot
                ));
    }

    public VolunteerApplicationResponse findAllMyApplications(
            Member member,
            VolunteerApplicationStatus status
    ) {
        var volunteerApplicationInfo = volunteerApplicationRepository.findAllMyApplications(member.getId(), status);
        return VolunteerApplicationResponse.from(volunteerApplicationInfo);

    }
}
