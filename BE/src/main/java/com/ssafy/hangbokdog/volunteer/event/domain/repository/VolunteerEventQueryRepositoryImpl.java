package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerEvent.volunteerEvent;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerSlot.volunteerSlot;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventQueryRepositoryImpl implements VolunteerEventQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<VolunteerInfo> findAllOpenEvents(Long centerId) {
        BooleanExpression openCondition = volunteerEvent.status.eq(VolunteerEventStatus.OPEN);
        // centerId 가 넘어오면 추가 필터
        BooleanExpression centerCondition = centerId != null
                ? volunteerEvent.centerId.eq(centerId)
                : null;

        return queryFactory
                .select(Projections.constructor(
                        VolunteerInfo.class,
                        volunteerEvent.id,
                        volunteerEvent.title,
                        volunteerEvent.content,
                        volunteerEvent.address,
                        volunteerEvent.locationType,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate
                ))
                .from(volunteerEvent)
                .where(openCondition, centerCondition)
                .fetch();
    }

    @Override
    public List<DailyApplicationInfo> findDailyApplications(Long eventId) {
        // 오전 Slot 집계: id, appliedCount, capacity
        NumberExpression<Long> morningSlotId = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.MORNING))
                .then(volunteerSlot.id)
                .otherwise((Long) null)
                .max();

        NumberExpression<Integer> morningApplied = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.MORNING))
                .then(volunteerSlot.appliedCount)
                .otherwise(0)
                .sum()
                .intValue();

        NumberExpression<Integer> morningCap = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.MORNING))
                .then(volunteerSlot.capacity)
                .otherwise(0)
                .sum();

        // 오후 Slot 집계: id, appliedCount, capacity
        NumberExpression<Long> afternoonSlotId = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.AFTERNOON))
                .then(volunteerSlot.id)
                .otherwise((Long) null)
                .max();

        NumberExpression<Integer> afternoonApplied = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.AFTERNOON))
                .then(volunteerSlot.appliedCount)
                .otherwise(0)
                .sum()
                .intValue();

        NumberExpression<Integer> afternoonCap = new CaseBuilder()
                .when(volunteerSlot.slotType.eq(SlotType.AFTERNOON))
                .then(volunteerSlot.capacity)
                .otherwise(0)
                .sum();

        return queryFactory
                .select(Projections.constructor(
                        DailyApplicationInfo.class,
                        volunteerSlot.volunteerDate,                                     // (1) date
                        // (2) morning SlotCapacity
                        Projections.constructor(
                                DailyApplicationInfo.SlotCapacity.class,
                                morningSlotId, morningApplied, morningCap
                        ),
                        // (3) afternoon SlotCapacity
                        Projections.constructor(
                                DailyApplicationInfo.SlotCapacity.class,
                                afternoonSlotId, afternoonApplied, afternoonCap
                        )
                ))
                .from(volunteerSlot)
                .join(volunteerEvent).on(volunteerSlot.eventId.eq(volunteerEvent.id))
                .where(
                        volunteerEvent.id.eq(eventId)
                                .and(volunteerSlot.volunteerDate
                                        .between(volunteerEvent.startDate, volunteerEvent.endDate))
                )
                .groupBy(volunteerSlot.volunteerDate)
                .orderBy(volunteerSlot.volunteerDate.asc())
                .fetch();
    }

    @Override
    public List<VolunteerInfo> findLatestVolunteerEvent(Long centerId) {
        return queryFactory.select(Projections.constructor(
                        VolunteerInfo.class,
                        volunteerEvent.id,
                        volunteerEvent.title,
                        volunteerEvent.content,
                        volunteerEvent.address,
                        volunteerEvent.locationType,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate
                ))
                .from(volunteerEvent)
                .where(volunteerEvent.status.eq(VolunteerEventStatus.OPEN).and(
                        volunteerEvent.centerId.eq(centerId)).and(
                                volunteerEvent.endDate.after((LocalDate.now()))
                        )
                )
                .orderBy(volunteerEvent.endDate.asc())
                .limit(3)
                .fetch();
    }
}
