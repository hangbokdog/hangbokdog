package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import static com.ssafy.hangbokdog.center.addressbook.domain.QAddressBook.addressBook;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerEvent.volunteerEvent;
import static com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus.OPEN;

import java.time.LocalDate;
import java.util.List;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.common.util.PageTokenParser;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEventStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerIdInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventQueryRepositoryImpl implements VolunteerEventQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<VolunteerInfo> findAllOpenEvents(Long centerId) {
        BooleanExpression openCondition = volunteerEvent.status.eq(OPEN);
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
                        volunteerEvent.addressName,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate,
                        volunteerEvent.imageUrls
                ))
                .from(volunteerEvent)
                .where(openCondition, centerCondition)
                .orderBy(volunteerEvent.startDate.asc())
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
                        volunteerEvent.addressName,
                        volunteerEvent.startDate,
                        volunteerEvent.endDate,
                        volunteerEvent.imageUrls
                ))
                .from(volunteerEvent)
                .where(volunteerEvent.status.eq(OPEN).and(
                        volunteerEvent.centerId.eq(centerId)).and(
                                volunteerEvent.endDate.after((LocalDate.now()))
                        )
                )
                .orderBy(volunteerEvent.endDate.asc())
                .limit(3)
                .fetch();
    }

    @Override
    public List<VolunteerInfo> findAllClosedEvents(Long centerId, String pageToken, int pageSize) {
        return queryFactory.select(Projections.constructor(
                VolunteerInfo.class,
                volunteerEvent.id,
                volunteerEvent.title,
                volunteerEvent.content,
                volunteerEvent.address,
                volunteerEvent.addressName,
                volunteerEvent.startDate,
                volunteerEvent.endDate,
                volunteerEvent.imageUrls
        ))
                .from(volunteerEvent)
                .where(volunteerEvent.status.eq(VolunteerEventStatus.CLOSED).and(
                        volunteerEvent.centerId.eq(centerId)), isInRange(pageToken))
                .orderBy(volunteerEvent.endDate.desc())
                .limit(pageSize)
                .fetch();

    }

    @Override
    public List<VolunteerInfo> findAllOpenEventsInAddressBook(Long addressBookId) {
        return queryFactory.select(Projections.constructor(
                VolunteerInfo.class,
                volunteerEvent.id,
                volunteerEvent.title,
                volunteerEvent.content,
                volunteerEvent.address,
                volunteerEvent.addressName,
                volunteerEvent.startDate,
                volunteerEvent.endDate,
                volunteerEvent.imageUrls
        )).from(volunteerEvent)
                .leftJoin(addressBook).on(addressBook.id.eq(volunteerEvent.addressBookId))
                .where(volunteerEvent.status.eq(OPEN).and(
                        volunteerEvent.addressBookId.eq(addressBookId)
                ))
                .fetch();
    }

    @Override
    public List<VolunteerInfo> findAllClosedEventsInAddressBook(Long addressBookId, String pageToken, int pageSize) {
        return queryFactory.select(Projections.constructor(
                VolunteerInfo.class,
                volunteerEvent.id,
                volunteerEvent.title,
                volunteerEvent.content,
                volunteerEvent.address,
                volunteerEvent.addressName,
                volunteerEvent.startDate,
                volunteerEvent.endDate,
                volunteerEvent.imageUrls
        )).from(volunteerEvent)
                .leftJoin(addressBook).on(addressBook.id.eq(volunteerEvent.addressBookId))
                .where(volunteerEvent.status.eq(VolunteerEventStatus.CLOSED).and(
                        volunteerEvent.addressBookId.eq(addressBookId)), isInRange(pageToken))
                .orderBy(volunteerEvent.endDate.desc())
                .limit(pageSize)
                .fetch();
    }

    @Override
    public List<VolunteerIdInfo> findActiveEventIds(List<Long> addressBookIds) {
        return queryFactory.select(Projections.constructor(
                VolunteerIdInfo.class,
                volunteerEvent.addressBookId,
                volunteerEvent.id
        )).from(volunteerEvent)
                .where(volunteerEvent.status.eq(OPEN).and(volunteerEvent.addressBookId.in(addressBookIds)))
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        Pair<String, String> token = PageTokenParser.parsePageToken(pageToken);
        if (LocalDate.parse(token.getLeft()).equals(volunteerEvent.endDate)) {
            return volunteerEvent.id.lt(Long.valueOf(token.getRight()));
        }

        return volunteerEvent.endDate.lt(LocalDate.parse(token.getLeft()));
    }
}
