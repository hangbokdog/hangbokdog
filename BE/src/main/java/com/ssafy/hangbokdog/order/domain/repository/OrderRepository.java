package com.ssafy.hangbokdog.order.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.order.domain.Order;
import com.ssafy.hangbokdog.order.dto.OrderResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final OrderJpaRepository orderJpaRepository;

    public Order save(Order order) {
        return orderJpaRepository.save(order);
    }

    public Optional<Order> findById(Long orderId) {
        return orderJpaRepository.findById(orderId);
    }

    public Integer getTotalAmountOfOngoingOrderPriceByBuyerId(Long buyerId) {
        return orderJpaRepository.getTotalAmountOfOngoingOrderPriceByBuyerId(buyerId);
    }

    public PageInfo<OrderResponse> findAllByBuyerId(Long memberId, String pageToken) {
        var orders = orderJpaRepository.findAllByBuyerId(memberId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(orders, DEFAULT_PAGE_SIZE, OrderResponse::id);
    }

    public void deleteByProductId(Long productId) {
        orderJpaRepository.deleteByProductId(productId);
    }

    public Optional<Order> findByProductId(Long productId) {
        return orderJpaRepository.findByProductId(productId);
    }
}
