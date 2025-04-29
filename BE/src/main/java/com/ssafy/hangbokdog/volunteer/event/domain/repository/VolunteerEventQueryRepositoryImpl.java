package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import static com.ssafy.hangbokdog.volunteer.application.domain.QVolunteerApplication.volunteerApplication;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerEvent.volunteerEvent;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerSlot.volunteerSlot;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponses;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventQueryRepositoryImpl implements VolunteerEventQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<VolunteerResponses> findAllOpenEvents() {
        return queryFactory
                .select(Projections.constructor(
                        VolunteerResponses.class,
                        volunteerEvent.id,
                        volunteerEvent.title,
                        volunteerEvent.content,
                        volunteerEvent.address,
                        volunteerEvent.locationType,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate
                ))
                .from(volunteerEvent)
                .where(volunteerEvent.status.eq(VolunteerEventStatus.OPEN))
                .fetch();
    }

    @Override
    public List<DailyApplicationInfo> findDailyApplications(Long eventId) {
        // 오전 승인 수 집계
        NumberExpression<Integer> morningApproved = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.MORNING)
                        .and(volunteerApplication.status.eq(VolunteerApplicationStatus.APPROVED)))
                .then(1L).otherwise(0L)
                .sum().intValue();

        // 오후 승인 수 집계
        NumberExpression<Integer> afternoonApproved = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.AFTERNOON)
                        .and(volunteerApplication.status.eq(VolunteerApplicationStatus.APPROVED)))
                .then(1L).otherwise(0L)
                .sum().intValue();

        // 오전 정원(capacity)
        NumberExpression<Integer> morningCap = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.MORNING))
                .then(volunteerSlot.capacity).otherwise(0)
                .sum();

        // 오후 정원
        NumberExpression<Integer> afternoonCap = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.AFTERNOON))
                .then(volunteerSlot.capacity).otherwise(0)
                .sum();

        return queryFactory
                .select(Projections.constructor(
                        DailyApplicationInfo.class,
                        // (1) 날짜
                        volunteerApplication.participationDate,
                        // (2) 오전 SlotCapacity
                        Projections.constructor(
                                DailyApplicationInfo.SlotCapacity.class,
                                morningApproved,
                                morningCap
                        ),
                        // (3) 오후 SlotCapacity
                        Projections.constructor(
                                DailyApplicationInfo.SlotCapacity.class,
                                afternoonApproved,
                                afternoonCap
                        )
                ))
                .from(volunteerEvent)
                .join(volunteerSlot).on(volunteerSlot.eventId.eq(volunteerEvent.id))
                .leftJoin(volunteerApplication)
                .on(volunteerApplication.volunteerId.eq(volunteerSlot.id)
                        .and(volunteerApplication.status.eq(VolunteerApplicationStatus.APPROVED)))
                .where(volunteerEvent.id.eq(eventId)
                        .and(volunteerApplication.participationDate
                                .between(volunteerEvent.startDate, volunteerEvent.endDate)))
                .groupBy(volunteerApplication.participationDate)
                .orderBy(volunteerApplication.participationDate.asc())
                .fetch();
    }
}
