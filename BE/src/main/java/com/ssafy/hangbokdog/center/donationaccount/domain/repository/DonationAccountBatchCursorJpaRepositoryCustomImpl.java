package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import static com.ssafy.hangbokdog.center.donationaccount.domain.QDonationAccountBatchCursor.donationAccountBatchCursor;

@Repository
@RequiredArgsConstructor
public class DonationAccountBatchCursorJpaRepositoryCustomImpl implements DonationAccountBatchCursorJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CenterKeyInfo> getCenterKeyInfos() {
		return queryFactory
				.select(
						Projections.constructor(
								CenterKeyInfo.class,
								donationAccountBatchCursor.centerId,
								donationAccountBatchCursor.lastUpdatedKey
						)
				)
				.from(donationAccountBatchCursor)
				.fetch();
	}

	@Override
	public void bulkUpdateLastUpdatedKeys(Map<Long, TransactionInfo> transactionInfos) {
		if (transactionInfos == null || transactionInfos.isEmpty()) {
			return;
		}

		CaseBuilder caseBuilder = new CaseBuilder();
		NumberExpression<Long> keyCase = donationAccountBatchCursor.lastUpdatedKey;

		for (Map.Entry<Long, TransactionInfo> entry : transactionInfos.entrySet()) {
			Long centerId = entry.getKey();
			Long newKey = entry.getValue().newLastUpdatedKey();

			keyCase = caseBuilder
					.when(donationAccountBatchCursor.centerId.eq(centerId))
					.then(newKey)
					.otherwise(keyCase);
		}

		queryFactory
				.update(donationAccountBatchCursor)
				.set(donationAccountBatchCursor.lastUpdatedKey, keyCase)
				.where(donationAccountBatchCursor.centerId.in(transactionInfos.keySet()))
				.execute();
	}

}
