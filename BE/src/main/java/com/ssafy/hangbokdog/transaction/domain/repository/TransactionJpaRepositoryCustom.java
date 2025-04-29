package com.ssafy.hangbokdog.transaction.domain.repository;

import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

public interface TransactionJpaRepositoryCustom {

	TransactionInfo getTransactionInfos(Long lastUpdatedKey);
}
