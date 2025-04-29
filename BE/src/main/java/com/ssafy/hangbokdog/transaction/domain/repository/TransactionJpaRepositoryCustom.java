package com.ssafy.hangbokdog.transaction.domain.repository;

import java.util.List;
import java.util.Map;

import com.ssafy.hangbokdog.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

public interface TransactionJpaRepositoryCustom {

	Map<Long, TransactionInfo> getTransactionInfosByCenter(List<CenterKeyInfo> centerKeyInfos);
}
