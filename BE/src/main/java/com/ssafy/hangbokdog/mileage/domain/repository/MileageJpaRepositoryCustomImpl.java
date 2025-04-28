package com.ssafy.hangbokdog.mileage.domain.repository;

import static com.ssafy.hangbokdog.mileage.domain.QMileage.*;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MileageJpaRepositoryCustomImpl implements MileageJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public void updateBulkMileage(Map<Long, Long> memberDeductions) {
		CaseBuilder caseBuilder = new CaseBuilder();
		NumberExpression<Long> caseExpression = mileage.balance;

		for (Map.Entry<Long, Long> entry : memberDeductions.entrySet()) {
			Long memberId = entry.getKey();
			Long amount = entry.getValue();

			caseExpression = caseBuilder
				.when(mileage.memberId.eq(memberId))
				.then(mileage.balance.subtract(amount))
				.otherwise(mileage.balance);
		}

		queryFactory.update(mileage)
			.set(mileage.balance, caseExpression)
			.where(mileage.memberId.in(memberDeductions.keySet()))
			.execute();
	}
}
