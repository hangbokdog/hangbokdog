package com.ssafy.hangbokdog.order.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.order.domain.Order;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {

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
}
