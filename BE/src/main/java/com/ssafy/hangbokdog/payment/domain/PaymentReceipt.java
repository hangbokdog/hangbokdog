package com.ssafy.hangbokdog.payment.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PaymentReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_recipt_id")
    private Long id;

    private String impUid;

    private String merchantUid;

    private String receiptUrl;

    private BigDecimal amount;

    @Builder
    public PaymentReceipt(
            String impUid,
            String merchantUid,
            String receiptUrl,
            BigDecimal amount
    ) {
        this.impUid = impUid;
        this.merchantUid = merchantUid;
        this.receiptUrl = receiptUrl;
        this.amount = amount;
    }
}
