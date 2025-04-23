package com.ssafy.hangbokdog.order.domain.repository;

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
}
