package com.ssafy.hangbokdog.member.domain.repository;

import static com.ssafy.hangbokdog.center.center.domain.QCenterMember.centerMember;
import static com.ssafy.hangbokdog.member.domain.QMember.member;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.member.dto.MemberAgeInfo;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberResponse;
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
						Expressions.numberTemplate(
								Integer.class,
								"timestampdiff(year, {0}, now())",
								member.birth
						),
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
						member.profileImage,
						member.emergencyNotificationCheck
				))
				.from(member)
				.where(member.id.eq(memberId))
				.fetchOne();
	}

	@Override
	public List<MemberAgeInfo> findByIdWithAge(List<Long> allParticipantIds) {
		return queryFactory
				.select(Projections.constructor(
						MemberAgeInfo.class,
						member.id,
						Expressions.numberTemplate(
								Integer.class,
								"timestampdiff(year, {0}, now())",
								member.birth
						)
				))
				.from(member)
				.where(member.id.in(allParticipantIds))
				.fetch();
	}

	@Override
	public List<MemberResponse> findMembersInCenter(
			Long centerId,
			String pageToken,
			int pageSize,
			CenterGrade grade
	) {
		return queryFactory.select(Projections.constructor(
				MemberResponse.class,
				member.id,
				member.name,
				member.nickName,
				member.profileImage,
				centerMember.grade,
				centerMember.id
		)).from(member)
				.leftJoin(centerMember).on(centerMember.memberId.eq(member.id))
				.where(centerMember.centerId.eq(centerId), isInRange(pageToken), isGrade(grade))
				.limit(pageSize + 1)
				.fetch();
	}

	@Override
	public Optional<CenterMemberResponse> findByIdWithCenterInfo(Long memberId, Long centerId) {
		return Optional.ofNullable(queryFactory.select(Projections.constructor(
				CenterMemberResponse.class,
				member.id,
				member.profileImage,
				member.name,
				member.nickName,
				centerMember.grade,
				member.email,
				member.phone,
				centerMember.createdAt
		)).from(member)
				.leftJoin(centerMember).on(centerMember.memberId.eq(member.id))
				.where(centerMember.centerId.eq(centerId).and(centerMember.memberId.eq(memberId)))
				.fetchOne());
	}

	@Override
	public int countMembersInCenter(Long centerId, CenterGrade grade) {
		return queryFactory.select(
				centerMember.count().intValue().coalesce(0)
		).from(centerMember)
				.where(centerMember.centerId.eq(centerId), isGrade(grade))
				.fetchOne();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}

		return centerMember.id.lt(Long.valueOf(pageToken));
	}

	private BooleanExpression isGrade(CenterGrade grade) {
		if (grade == null) {
			return null;
		}

		return centerMember.grade.eq(grade);
	}
}
