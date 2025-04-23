package com.ssafy.hangbokdog.order.domain.repository;

public interface OrderQueryRepository {
    Integer getTotalAmountOfOngoingOrderPriceByBuyerId(Long buyerId);
}
