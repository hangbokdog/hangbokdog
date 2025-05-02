package com.ssafy.hangbokdog.order.domain;

import static com.ssafy.hangbokdog.order.domain.OrderStatus.CANCEL;
import static com.ssafy.hangbokdog.order.domain.OrderStatus.COMPLETE;
import static com.ssafy.hangbokdog.order.domain.OrderStatus.ONGOING;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "orders")
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @Builder
    public Order(
            Long id,
            Long productId,
            Long buyerId,
            int amount
    ) {
        this.id = id;
        this.productId = productId;
        this.buyerId = buyerId;
        this.status = ONGOING;
        this.amount = amount;
    }

    public boolean isBuyer(Member buyer) {
        return buyer.getId().equals(buyerId);
    }

    public void confirm() {
        status = COMPLETE;
    }

    public void cancel() {
        status = CANCEL;
    }
}
