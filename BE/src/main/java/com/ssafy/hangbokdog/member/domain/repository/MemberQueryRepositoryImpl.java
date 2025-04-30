package com.ssafy.hangbokdog.member.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QCenterMember.centerMember;
import static com.ssafy.hangbokdog.member.domain.QMember.member;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberQueryRepositoryImpl implements MemberQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<MemberSearchNicknameResponse> findByNickname(String nickname) {
        return queryFactory
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
                .where(member.nickName.containsIgnoreCase(nickname))
                .fetch();
    }

    @Override
    public List<String> findFcmTokensByCenterId(Long centerId) {
        return queryFactory
                .select(member.fcmToken)
                .from(member)
                .leftJoin(centerMember)
                .on(member.id.eq(centerMember.memberId))
                .where(centerMember.centerId.eq(centerId))
                .fetch();
    }
}
