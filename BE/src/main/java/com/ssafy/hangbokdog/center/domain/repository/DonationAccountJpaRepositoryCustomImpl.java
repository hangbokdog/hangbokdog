package com.ssafy.hangbokdog.center.domain.repository;

import static com.ssafy.hangbokdog.center.domain.QDonationAccount.*;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationAccountJpaRepositoryCustomImpl implements DonationAccountJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<CenterKeyInfo> getCenterKeyInfos() {
		return queryFactory
			.select(
				Projections.constructor(
					CenterKeyInfo.class,
					donationAccount.centerId,
					donationAccount.lastUpdatedKey
				))
			.from(donationAccount)
			.fetch();
	}

	@Override
	public void bulkUpdateDonationAccounts(Map<Long, TransactionInfo> transactionInfos) {
		if (transactionInfos == null || transactionInfos.isEmpty()) {
			return;
		}

		CaseBuilder caseBuilder = new CaseBuilder();

		NumberExpression<Long> balanceCase = donationAccount.balance;

		NumberExpression<Long> keyCase = donationAccount.lastUpdatedKey;

		for (Map.Entry<Long, TransactionInfo> entry : transactionInfos.entrySet()) {
			Long centerId = entry.getKey();
			TransactionInfo info = entry.getValue();

			balanceCase = caseBuilder
				.when(donationAccount.centerId.eq(centerId))
				.then(donationAccount.balance.add(info.sum()))
				.otherwise(balanceCase);

			keyCase = caseBuilder
				.when(donationAccount.centerId.eq(centerId))
				.then(info.newLastUpdatedKey())
				.otherwise(keyCase);
		}

		queryFactory.update(donationAccount)
			.set(donationAccount.balance, balanceCase)
			.set(donationAccount.lastUpdatedKey, keyCase)
			.where(donationAccount.centerId.in(transactionInfos.keySet()))
			.execute();
	}
}
