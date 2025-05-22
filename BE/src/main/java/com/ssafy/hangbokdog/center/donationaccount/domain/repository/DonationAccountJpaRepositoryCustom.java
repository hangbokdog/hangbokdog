package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import java.util.List;
import java.util.Map;

import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

public interface DonationAccountJpaRepositoryCustom {

	List<CenterKeyInfo> getCenterKeyInfos();

	void bulkUpdateDonationAccounts(Map<Long, TransactionInfo> transactionInfos);
}
