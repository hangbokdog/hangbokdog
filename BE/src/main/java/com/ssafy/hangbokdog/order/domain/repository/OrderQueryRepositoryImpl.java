package com.ssafy.hangbokdog.order.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.order.domain.QOrder.order;
import static com.ssafy.hangbokdog.product.domain.QProduct.product;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.order.domain.OrderStatus;
import com.ssafy.hangbokdog.order.dto.OrderResponse;

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

    @Override
    public List<OrderResponse> findAllByBuyerId(Long memberId, String pageToken, int pageSize) {
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        order.id,
                        order.amount.intValue(),
                        order.status,
                        product.imageUrls,
                        product.name,
                        member.nickName,
                        member.id
                )).from(order)
                .leftJoin(product).on(product.id.eq(order.productId))
                .leftJoin(member).on(member.id.eq(product.sellerId))
                .where(order.buyerId.eq(memberId), isInRange(pageToken))
                .orderBy(order.id.desc())
                .limit(pageSize + 1)
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return order.id.lt(Long.valueOf(pageToken));
    }
}
