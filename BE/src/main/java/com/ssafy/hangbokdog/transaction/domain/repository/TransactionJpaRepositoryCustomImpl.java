package com.ssafy.hangbokdog.transaction.domain.repository;

import static com.ssafy.hangbokdog.transaction.domain.QTransaction.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionJpaRepositoryCustomImpl implements TransactionJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Map<Long, TransactionInfo> getTransactionInfosByCenter(List<CenterKeyInfo> centerKeyInfos) {
		BooleanBuilder whereClause = new BooleanBuilder();

		for (CenterKeyInfo centerKey : centerKeyInfos) {
			whereClause.or(
				transaction.centerId.eq(centerKey.centerId())
					.and(transaction.id.gt(centerKey.lastUpdatedKey()))
			);
		}

		List<TransactionInfo> results = queryFactory
			.select(
				Projections.constructor(
					TransactionInfo.class,
					transaction.centerId,
					transaction.count().intValue(),
					transaction.amount.sum().coalesce(0).longValue(),
					transaction.id.max()
				))
			.from(transaction)
			.where(whereClause)
			.groupBy(transaction.centerId)
			.fetch();

		return results.stream()
			.collect(Collectors.toMap(TransactionInfo::centerId, info -> info));
	}

}
