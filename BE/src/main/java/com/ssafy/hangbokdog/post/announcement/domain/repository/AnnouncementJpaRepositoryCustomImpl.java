package com.ssafy.hangbokdog.post.announcement.domain.repository;

import static com.ssafy.hangbokdog.dog.dog.domain.QDog.*;
import static com.ssafy.hangbokdog.member.domain.QMember.*;
import static com.ssafy.hangbokdog.post.announcement.domain.QAnnouncement.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementDetailResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AnnouncementJpaRepositoryCustomImpl implements AnnouncementJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<AnnouncementResponse> getAllAnnouncements(Long centerId, String pageToken, int pageSize) {
		return queryFactory
			.select(Projections.constructor(
				AnnouncementResponse.class,
				announcement.id,
				announcement.authorId,
				member.nickName,
				member.profileImage,
				announcement.title,
				announcement.createdAt
			))
			.from(announcement)
			.leftJoin(member).on(member.id.eq(announcement.authorId))
			.where(announcement.centerId.eq(centerId),
				isInRange(pageToken))
			.limit(pageSize + 1)
			.orderBy(announcement.id.desc())
			.fetch();
	}

	@Override
	public AnnouncementDetailResponse getAnnouncement(Long announcementId) {
		return queryFactory.select(
			Projections.constructor(
				AnnouncementDetailResponse.class,
				announcement.id,
				announcement.authorId,
				member.nickName,
				member.profileImage,
				announcement.title,
				announcement.content,
				announcement.imageUrls,
				announcement.createdAt
			))
			.from(announcement)
			.where(announcement.id.eq(announcementId))
			.fetchOne();
	}

	@Override
	public List<AnnouncementResponse> getLatest(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				AnnouncementResponse.class,
				announcement.id,
				announcement.authorId,
				member.nickName,
				member.profileImage,
				announcement.title,
				announcement.createdAt
			))
			.from(announcement)
			.where(announcement.centerId.eq(centerId))
			.orderBy(announcement.id.desc())
			.limit(5)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return announcement.id.lt(Long.parseLong(pageToken));
	}
}
