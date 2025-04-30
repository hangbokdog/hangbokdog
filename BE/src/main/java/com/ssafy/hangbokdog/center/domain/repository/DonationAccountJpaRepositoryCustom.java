package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;
import java.util.Map;

import com.ssafy.hangbokdog.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

public interface DonationAccountJpaRepositoryCustom {

	List<CenterKeyInfo> getCenterKeyInfos();

	void bulkUpdateDonationAccounts(Map<Long, TransactionInfo> transactionInfos);
}
