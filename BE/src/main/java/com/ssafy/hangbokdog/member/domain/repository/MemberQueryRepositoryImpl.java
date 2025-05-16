package com.ssafy.hangbokdog.member.domain.repository;

import static com.ssafy.hangbokdog.center.center.domain.QCenterMember.centerMember;
import static com.ssafy.hangbokdog.member.domain.QMember.member;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.MemberAgeInfo;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberQueryRepositoryImpl implements MemberQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<MemberSearchNicknameResponse> findByNickname(String nickname) {
        return Optional.ofNullable(queryFactory
                .select(Projections.constructor(
                        MemberSearchNicknameResponse.class,
                        member.id,
                        member.nickName,
                        member.name,
                        member.phone,
                        member.age,
                        member.grade,
                        member.profileImage
                ))
                .from(member)
                .where(member.nickName.eq(nickname))
                .fetchOne()
        );
    }

    @Override
    public List<String> findFcmTokensByCenterId(Long centerId) {
        return queryFactory
            .select(member.fcmToken)
            .from(member)
            .leftJoin(centerMember).on(member.id.eq(centerMember.memberId))
            .where(
                centerMember.centerId.eq(centerId)
                    .and(member.fcmToken.isNotNull())
                    .and(member.fcmToken.ne(""))
            )
            .fetch();
    }

    @Override
    public MemberProfileResponse getMemberProfile(Long memberId) {
        return queryFactory
                .select(Projections.constructor(
                        MemberProfileResponse.class,
                        member.id,
                        member.name,
                        member.nickName,
                        member.profileImage
                ))
                .from(member)
                .where(member.id.eq(memberId))
                .fetchOne();
    }

    @Override
    public List<MemberAgeInfo> findByIdWithAge(List<Long> allParticipantIds) {
        return queryFactory.select(Projections.constructor(
                MemberAgeInfo.class,
                member.id,
                member.age
        )).from(member)
                .where(member.id.in(allParticipantIds))
                .fetch();
    }
}
