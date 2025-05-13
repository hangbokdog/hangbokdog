package com.ssafy.hangbokdog.transaction.domain.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionRepository {

    private final TransactionJpaRepository transactionJpaRepository;
    private final TransactionJdbcRepository transactionJdbcRepository;
    private final TransactionJpaRepositoryCustomImpl transactionJpaRepositoryCustom;

    public Transaction save(Transaction transaction) {
        return transactionJpaRepository.save(transaction);
    }

    public void bulkInsert(List<Transaction> transactions) {
        transactionJdbcRepository.batchInsert(transactions);
    }

    public Map<Long, TransactionInfo> getTransactionInfoByCenter(List<CenterKeyInfo> centerKeyInfos) {
        return transactionJpaRepositoryCustom.getTransactionInfosByCenter(centerKeyInfos);
    }
}
