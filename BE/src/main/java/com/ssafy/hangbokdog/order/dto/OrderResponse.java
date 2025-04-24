package com.ssafy.hangbokdog.order.dto;

import java.util.List;

import com.ssafy.hangbokdog.order.domain.OrderStatus;

/**
 *
 * TODO : 화면 나오면 spec 수정
 */
public record OrderResponse(
        Long id,
        int amount,
        OrderStatus status,
        List<String> productPresentationImageUrl,
        String productName,
        String sellerName,
        Long sellerId
) {
}
