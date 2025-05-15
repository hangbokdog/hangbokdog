package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerSlot.volunteerSlot;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerSlotQueryRepositoryImpl implements VolunteerSlotQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<SlotDto> findByEventId(Long eventId) {
        return queryFactory
                .select(Projections.constructor(
                        SlotDto.class,
                        volunteerSlot.slotType,
                        volunteerSlot.startTime,
                        volunteerSlot.endTime,
                        volunteerSlot.capacity
                ))
                .distinct()
                .from(volunteerSlot)
                .where(volunteerSlot.eventId.eq(eventId))
                .fetch();
    }

    @Override
    public List<VolunteerSlotResponse> findAllByEventId(Long eventId) {
        return queryFactory.select(Projections.constructor(
                VolunteerSlotResponse.class,
                volunteerSlot.id,
                volunteerSlot.slotType,
                volunteerSlot.startTime,
                volunteerSlot.endTime,
                volunteerSlot.volunteerDate,
                volunteerSlot.capacity,
                volunteerSlot.appliedCount
        )).from(volunteerSlot)
                .where(volunteerSlot.eventId.eq(eventId))
                .fetch();
    }

    @Override
    public Integer getAppliedCountByVolunteerIdsIn(List<Long> volunteerEventIds) {
        return queryFactory.select(volunteerSlot.appliedCount.sum())
                .from(volunteerSlot)
                .where(volunteerSlot.eventId.in(volunteerEventIds))
                .fetchOne();
    }

    @Override
    public List<VolunteerAppliedCount> getAppliedCountByVolunteerIdsInWithGroupByVolunteerId(
            List<Long> volunteerEventIds
    ) {
        return queryFactory.select(Projections.constructor(
                VolunteerAppliedCount.class,
                volunteerSlot.eventId,
                volunteerSlot.appliedCount.sum().intValue()
        )).from(volunteerSlot)
                .where(volunteerSlot.eventId.in(volunteerEventIds))
                .groupBy(volunteerSlot.eventId)
                .fetch();
    }
}
