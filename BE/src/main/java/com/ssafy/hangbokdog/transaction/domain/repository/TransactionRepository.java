package com.ssafy.hangbokdog.transaction.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.transaction.domain.Transaction;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionRepository {

    private final TransactionJpaRepository transactionJpaRepository;
    private final TransactionJdbcRepository transactionJdbcRepository;

    public Transaction save(Transaction transaction) {
        return transactionJpaRepository.save(transaction);
    }

    public void bulkInsert(List<Transaction> transactions) {
        transactionJdbcRepository.batchInsert(transactions);
    }
}
