package com.ssafy.hangbokdog.transaction.domain.repository;

import static com.ssafy.hangbokdog.transaction.domain.QTransaction.*;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionJpaRepositoryCustomImpl implements TransactionJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public TransactionInfo getTransactionInfos(Long lastUpdatedKey) {
		return queryFactory
			.select(
				Projections.constructor(
					TransactionInfo.class,
					transaction.count().intValue(),
					transaction.amount.sum().coalesce(0).longValue(),
					transaction.id.max()
				))
			.from(transaction)
			.where(transaction.id.gt(lastUpdatedKey))
			.fetchOne();
	}
}
