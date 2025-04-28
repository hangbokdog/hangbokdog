package com.ssafy.hangbokdog.payment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.payment.domain.PaymentReceipt;

public interface PaymentReceiptJpaRepository extends JpaRepository<PaymentReceipt, Long> {
    boolean existsByImpUid(String impUid);
}
