package com.ssafy.hangbokdog.transaction.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.transaction.domain.Transaction;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionRepository {

    private final TransactionJpaRepository transactionJpaRepository;

    public Transaction save(Transaction transaction) {
        return transactionJpaRepository.save(transaction);
    }
}
