package com.ssafy.hangbokdog.member.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;

import java.util.List;

import com.querydsl.core.types.Projections;
import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class MemberQueryRepositoryImpl implements MemberQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<MemberInfo> findByNickname(String nickname) {
        return queryFactory
                .select(Projections.constructor(
                        MemberInfo.class,
                        member.id,
                        member.nickName,
                        member.grade.stringValue(),
                        member.profileImage
                ))
                .from(member)
                .where(member.nickName.containsIgnoreCase(nickname))
                .fetch();
    }
}
