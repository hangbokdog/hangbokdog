package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.volunteer.application.domain.QVolunteerApplication.*;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerEvent.volunteerEvent;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerSlot.volunteerSlot;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.dto.VolunteerApplicationStatusInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.ApplicationResponse;
import com.ssafy.hangbokdog.volunteer.application.dto.response.MemberApplicationInfo;
import com.ssafy.hangbokdog.volunteer.application.dto.response.WeeklyApplicationResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerSlotAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerApplicationQueryRepositoryImpl implements VolunteerApplicationQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<WeeklyApplicationResponse> findByMemberIdAndParticipationDateBetween(
            Long memberId,
            LocalDate weekStart,
            LocalDate weekEnd
    ) {
        List<Tuple> tuples = queryFactory
                .select(
                        volunteerSlot.volunteerDate,           // 날짜
                        volunteerApplication.id,               // applicationId (null 이면 신청 없음)
                        volunteerApplication.status,           // application status
                        volunteerEvent.id,                     // eventId
                        volunteerEvent.title,
                        volunteerEvent.content,
                        volunteerEvent.address,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate
                )
                .from(volunteerSlot)
                .join(volunteerEvent).on(volunteerSlot.eventId.eq(volunteerEvent.id))
                .leftJoin(volunteerApplication)
                .on(volunteerApplication.volunteerId.eq(volunteerSlot.id)
                        .and(volunteerApplication.memberId.eq(memberId)))
                .where(volunteerSlot.volunteerDate.between(weekStart, weekEnd))
                .orderBy(volunteerSlot.volunteerDate.asc())
                .fetch();

        Map<LocalDate, List<WeeklyApplicationResponse.VolunteerApplicationInfo>> grouped = new LinkedHashMap<>();
        Map<LocalDate, Set<Long>> seenEventIds = new HashMap<>();

        for (Tuple t : tuples) {
            LocalDate date = t.get(volunteerSlot.volunteerDate);

            // 1) 날짜별 빈 리스트, seen set 초기화
            grouped.computeIfAbsent(date, d -> new ArrayList<>());
            seenEventIds.computeIfAbsent(date, d -> new HashSet<>());

            Long applicationId = t.get(volunteerApplication.id);
            if (applicationId == null) {
                continue;  // 신청 없음
            }

            // 2) 같은 이벤트에 대해 한 번만 추가
            Long eventId = t.get(volunteerEvent.id);
            if (!seenEventIds.get(date).add(eventId)) {
                continue;  // 이미 추가된 이벤트
            }

            // 3) 이벤트 요약 정보 생성
            VolunteerInfo vInfo = new VolunteerInfo(
                    eventId,
                    t.get(volunteerEvent.title),
                    t.get(volunteerEvent.content),
                    t.get(volunteerEvent.address),
                    t.get(volunteerEvent.addressName),
                    t.get(volunteerEvent.startDate),
                    t.get(volunteerEvent.endDate),
                    t.get(volunteerEvent.imageUrls)
            );

            // 4) DTO에 추가
            grouped.get(date).add(
                    new WeeklyApplicationResponse.VolunteerApplicationInfo(
                            applicationId,
                            vInfo,
                            t.get(volunteerApplication.status)
                    )
            );
        }

        // 3) LinkedHashMap 순서대로 WeeklyApplicationResponse 생성
        return grouped.entrySet().stream()
                .map(e -> new WeeklyApplicationResponse(
                        e.getKey(),
                        e.getValue()
                ))
                .toList();
    }

    @Override
    public List<ApplicationResponse> findAll(
            Long volunteerEventId,
            VolunteerApplicationStatus status,
            String pageToken,
            int pageSize
    ) {
        return queryFactory.select(Projections.constructor(
                ApplicationResponse.class,
                    volunteerApplication.id,
                    volunteerApplication.memberId,
                    volunteerApplication.volunteerId,
                    volunteerApplication.status,
                    volunteerApplication.createdAt,
                    member.name,
                    member.nickName,
                    member.birth,
                    member.phone,
                        Expressions.numberTemplate(
                                Integer.class,
                                "timestampdiff(year, {0}, now())",
                                member.birth
                        ),
                    member.grade,
                    member.email,
                    member.profileImage
                )).from(volunteerApplication)
                .leftJoin(member).on(member.id.eq(volunteerApplication.memberId))
                .where(volunteerApplication.volunteerEventId.eq(volunteerEventId).and(
                        volunteerApplication.status.eq(status)
                ), isInRange(pageToken))
                .limit(pageSize)
                .fetch();
    }

    @Override
    public List<VolunteerApplicationStatusInfo> findByEventIdsIn(Long memberId, List<Long> volunteerIds) {
        return queryFactory.select(Projections.constructor(
                VolunteerApplicationStatusInfo.class,
                volunteerApplication.volunteerEventId,
                volunteerApplication.status
        )).from(volunteerApplication)
                .where(volunteerApplication.volunteerEventId.in(volunteerIds)
                        .and(volunteerApplication.memberId.eq(memberId)))
                .fetch();
    }

    @Override
    public List<ApplicationResponse> findByVolunteerId(Long slotId, VolunteerApplicationStatus status) {
        return queryFactory.select(Projections.constructor(
                        ApplicationResponse.class,
                        volunteerApplication.id,
                        volunteerApplication.memberId,
                        volunteerApplication.volunteerId,
                        volunteerApplication.status,
                        volunteerApplication.createdAt,
                        member.name,
                        member.nickName,
                        member.birth,
                        member.phone,
                        Expressions.numberTemplate(
                                Integer.class,
                                "timestampdiff(year, {0}, now())",
                                member.birth
                        ),
                        member.grade,
                        member.email,
                        member.profileImage
                )).from(volunteerApplication)
                .leftJoin(member).on(member.id.eq(volunteerApplication.memberId))
                .where(volunteerApplication.volunteerId.eq(slotId)
                        .and(volunteerApplication.status.eq(status)))
                .fetch();
    }

    @Override
    public List<VolunteerSlotAppliedCount> findSlotsWithAppliedCountByIdIn(List<Long> volunteerSlotIds) {
        return queryFactory.select(Projections.constructor(
                VolunteerSlotAppliedCount.class,
                volunteerApplication.volunteerId,
                volunteerApplication.volunteerId.count().intValue()
        )).from(volunteerApplication)
                .where(volunteerApplication.volunteerId.in(volunteerSlotIds)
                        .and(volunteerApplication.status.eq(VolunteerApplicationStatus.APPROVED))
                ).groupBy(volunteerApplication.volunteerId)
                .fetch();
    }

    @Override
    public List<MemberApplicationInfo> findAllMyApplications(
            Long memberId,
            VolunteerApplicationStatus status
    ) {
        return queryFactory.select(Projections.constructor(
                MemberApplicationInfo.class,
                volunteerEvent.id,
                volunteerSlot.volunteerDate,
                volunteerSlot.startTime,
                volunteerSlot.endTime,
                volunteerEvent.title,
                volunteerApplication.status
        )).from(volunteerApplication)
                .join(volunteerEvent).on(volunteerEvent.id.eq(volunteerApplication.volunteerEventId))
                .join(volunteerSlot).on(volunteerSlot.id.eq(volunteerApplication.volunteerId))
                .where(volunteerApplication.memberId.eq(memberId).and(
                        volunteerApplication.status.eq(status)
                )).fetch();
    }

    @Override
    public int getTotalCompletedApplicationCountByVolunteerEventIdsIn(List<Long> volunteerEventIds) {
        Integer result = queryFactory
                .select(volunteerApplication.memberId.countDistinct().intValue())
                .from(volunteerApplication)
                .where(volunteerApplication.volunteerEventId.in(volunteerEventIds)
                        .and(volunteerApplication.status.eq(VolunteerApplicationStatus.COMPLETED)))
                .fetchOne();

        return result != null ? result : 0;
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return volunteerApplication.id.lt(Long.valueOf(pageToken));
    }
}
