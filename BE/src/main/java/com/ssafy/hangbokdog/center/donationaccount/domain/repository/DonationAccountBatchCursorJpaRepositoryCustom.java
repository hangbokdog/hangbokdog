package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import java.util.List;
import java.util.Map;

public interface DonationAccountBatchCursorJpaRepositoryCustom {
	List<CenterKeyInfo> getCenterKeyInfos();
	void bulkUpdateLastUpdatedKeys(Map<Long, TransactionInfo> transactionInfos);
}
