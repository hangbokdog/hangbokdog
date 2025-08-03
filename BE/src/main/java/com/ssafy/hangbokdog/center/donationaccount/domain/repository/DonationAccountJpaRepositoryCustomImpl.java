package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import static com.ssafy.hangbokdog.center.donationaccount.domain.QDonationAccount.*;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationAccountJpaRepositoryCustomImpl implements DonationAccountJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public void bulkUpdateDonationAccounts(Map<Long, TransactionInfo> transactionInfos) {
		if (transactionInfos == null || transactionInfos.isEmpty()) {
			return;
		}

		CaseBuilder caseBuilder = new CaseBuilder();
		NumberExpression<Long> balanceCase = donationAccount.balance;

		for (Map.Entry<Long, TransactionInfo> entry : transactionInfos.entrySet()) {
			Long centerId = entry.getKey();
			TransactionInfo info = entry.getValue();

			balanceCase = caseBuilder
					.when(donationAccount.centerId.eq(centerId))
					.then(donationAccount.balance.add(info.sum()))
					.otherwise(balanceCase);
		}

		queryFactory.update(donationAccount)
				.set(donationAccount.balance, balanceCase)
				.where(donationAccount.centerId.in(transactionInfos.keySet()))
				.execute();
	}
}
