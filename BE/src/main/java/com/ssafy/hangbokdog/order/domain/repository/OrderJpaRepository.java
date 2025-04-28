package com.ssafy.hangbokdog.order.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.order.domain.Order;

public interface OrderJpaRepository extends JpaRepository<Order, Long>, OrderQueryRepository {
}
