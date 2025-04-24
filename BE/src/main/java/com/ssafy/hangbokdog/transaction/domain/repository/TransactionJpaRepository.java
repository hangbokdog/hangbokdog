package com.ssafy.hangbokdog.transaction.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.transaction.domain.Transaction;

public interface TransactionJpaRepository extends JpaRepository<Transaction, Long> {
}
