package com.ssafy.hangbokdog.notification.domain.repository;

import static com.ssafy.hangbokdog.notification.domain.QNotification.notification;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.notification.dto.response.NotificationResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationJpaRepositoryCustomImpl implements NotificationJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<NotificationResponse> getNotifications(
			Long memberId,
			String pageToken,
			int pageSize
	) {
		return queryFactory
				.select(Projections.constructor(
						NotificationResponse.class,
						notification.id,
						notification.targetId,
						notification.type,
						notification.title,
						notification.content,
						notification.createdAt
				))
				.from(notification)
				.where(notification.receiverId.eq(memberId),
						isInRange(pageToken))
				.orderBy(notification.id.desc())
				.limit(pageSize + 1)
				.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}
		return notification.id.lt(Long.parseLong(pageToken));
	}
}
