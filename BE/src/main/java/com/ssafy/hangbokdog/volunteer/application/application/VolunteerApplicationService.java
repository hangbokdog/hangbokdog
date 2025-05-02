package com.ssafy.hangbokdog.volunteer.application.application;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;
import com.ssafy.hangbokdog.volunteer.application.domain.repository.VolunteerApplicationRepository;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationCreateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.request.VolunteerApplicationStatusUpdateRequest;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerApplicationService {

    private final VolunteerApplicationRepository volunteerApplicationRepository;
    private final VolunteerEventRepository volunteerEventRepository;
    private final VolunteerSlotRepository volunteerSlotRepository;
    private final MemberRepository memberRepository;
    private final CenterMemberRepository centerMemberRepository;

    public void apply(Member member, Long eventId, VolunteerApplicationCreateRequest request) {
        // 1) 이벤트 존재 확인
        VolunteerEvent event = volunteerEventRepository.findById(eventId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));

        List<VolunteerApplication> toSave = new ArrayList<>();

        // 2) 날짜별/슬롯별 신청 처리
        for (var app : request.applications()) {
            LocalDate date = app.date();

            // 2-1) 이 신청 건의 전체 참가자 ID 목록 (대표자 + 동행자)
            List<Long> pIds = Stream
                    .concat(app.participantIds().stream(), Stream.of(member.getId()))
                    .distinct()
                    .toList();

            // 2-2) 날짜별 반복문 내에서 **나이 유효성 검사**
            for (Long pid : pIds) {
                Member mem = memberRepository.findById(pid)
                        .orElseThrow(() -> new BadRequestException(ErrorCode.MEMBER_NOT_FOUND, "memberId: " + pid));
                if (!mem.isAdult()) {
                    throw new BadRequestException(ErrorCode.VOLUNTEER_UNDERAGE, "memberId: " + pid);
                }
            }

            // 2-3) 이 신청 건에 포함된 slotId 만큼 반복
            for (Long slotId : app.volunteerSlotIds()) {
                VolunteerSlot slot = volunteerSlotRepository.findById(slotId)
                        .orElseThrow(() -> new BadRequestException(ErrorCode.SLOT_NOT_FOUND));

                // 2-4) 중복 신청 체크
                for (Long pid : pIds) {
                    boolean already = volunteerApplicationRepository.existsByVolunteerIdAndMemberId(slotId, pid);
                    if (already) {
                        throw new BadRequestException(ErrorCode.DUPLICATE_APPLICATION,
                                "slotId: " + slotId + ", memberId: " + pid);
                    }
                }

                // 2-5) 정원 초과 체크
                int cap = slot.getCapacity();
                int curr = slot.getAppliedCount();
                if (curr + pIds.size() > cap) {
                    throw new BadRequestException(ErrorCode.SLOT_FULL, "slotId: " + slotId);
                }

                // 2-6) VolunteerApplication 엔티티 생성
                for (Long pid : pIds) {
                    toSave.add(VolunteerApplication.builder()
                            .memberId(pid)
                            .volunteerId(slotId)
                            .build()
                    );
                }

                // 2-7) 슬롯 appliedCount 즉시 갱신
                slot.increaseAppliedCount(pIds.size());
            }
        }

        // 3) 일괄 저장
        volunteerApplicationRepository.saveAll(toSave);
    }

    public List<WeeklyApplicationResponse> getWeeklyApplications(Member member, LocalDate date) {
        // 1) 이번 주 일요일 ~ 토요일 계산
        LocalDate weekStart = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate weekEnd   = date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        // TODO: PENDING, APPROVED인 것들만 보여야 할까?
        return volunteerApplicationRepository.findByMemberIdAndParticipationDateBetween(
                member.getId(),
                weekStart,
                weekEnd
        );
    }

    @Transactional
    public void updateStatus(Long memberId, Long applicationId, VolunteerApplicationStatusUpdateRequest request) {

        VolunteerApplication application = volunteerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_NOT_FOUND));

        VolunteerEvent volunteerEvent = volunteerEventRepository.findById(application.getVolunteerId())
            .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));

        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, volunteerEvent.getCenterId())
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        VolunteerSlot slot = volunteerSlotRepository.findById(application.getVolunteerId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.SLOT_NOT_FOUND));

        // 신청(이벤트) 날짜가 지났으면 수정 불가
        LocalDate today = LocalDate.now();
        LocalDate eventDate = slot.getVolunteerDate();
        if (eventDate.isBefore(today)) {
            throw new BadRequestException(ErrorCode.VOLUNTEER_APPLICATION_PROCESSING_FAILED);
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
}
