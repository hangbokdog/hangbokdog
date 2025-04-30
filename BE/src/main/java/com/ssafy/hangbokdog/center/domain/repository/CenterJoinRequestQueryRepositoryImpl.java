package com.ssafy.hangbokdog.center.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenterJoinRequest.centerJoinRequest;
import static com.ssafy.hangbokdog.member.domain.QMember.member;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.dto.response.CenterJoinRequestResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterJoinRequestQueryRepositoryImpl implements CenterJoinRequestQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<CenterJoinRequestResponse> findByCenterId(Long centerId, String pageToken, int pageSize) {
        return queryFactory.select(
                Projections.constructor(
                        CenterJoinRequestResponse.class,
                        centerJoinRequest.id,
                        member.name,
                        member.profileImage
                )).from(centerJoinRequest)
                .leftJoin(member).on(centerJoinRequest.memberId.eq(member.id))
                .where(centerJoinRequest.centerId.eq(centerId), isInRange(pageToken))
                .limit(pageSize + 1)
                .orderBy(centerJoinRequest.id.desc())
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return centerJoinRequest.id.lt(Long.valueOf(pageToken));
    }
}
