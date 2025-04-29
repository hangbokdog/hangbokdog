package com.ssafy.hangbokdog.transaction.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

public interface TransactionJpaRepository extends JpaRepository<Transaction, Long>, TransactionJpaRepositoryCustom {

	TransactionInfo getTransactionInfos(Long lastUpdatedKey);
}
