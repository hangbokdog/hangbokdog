package com.ssafy.hangbokdog.order.domain.repository;

import static com.ssafy.hangbokdog.order.domain.QOrder.order;
import static com.ssafy.hangbokdog.product.domain.QProduct.product;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.order.domain.OrderStatus;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderQueryRepositoryImpl implements OrderQueryRepository {

    private final JPAQueryFactory queryFactory;

    public Integer getTotalAmountOfOngoingOrderPriceByBuyerId(Long buyerId) {
        return queryFactory
                .select(product.price.sum().coalesce(0))
                .from(order)
                .innerJoin(product).on(order.productId.eq(product.id))
                .where(order.buyerId.eq(buyerId)
                        .and(order.status.eq(OrderStatus.ONGOING)))
                .fetchOne();
    }
}
