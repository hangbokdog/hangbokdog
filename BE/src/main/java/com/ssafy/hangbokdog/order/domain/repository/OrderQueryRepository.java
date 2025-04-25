package com.ssafy.hangbokdog.order.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.order.dto.OrderResponse;

public interface OrderQueryRepository {
    Integer getTotalAmountOfOngoingOrderPriceByBuyerId(Long buyerId);

    List<OrderResponse> findAllByBuyerId(Long memberId, String pageToken, int pageSize);
}
