package com.ssafy.hangbokdog.order.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.order.application.OrderService;
import com.ssafy.hangbokdog.order.dto.OrderResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/v1/products/{productId}/order")
    public ResponseEntity<Void> createOrder(
            @AuthMember Member member,
            @PathVariable(value = "productId") Long productId
    ) {
        Long orderId = orderService.order(member, productId);
        return ResponseEntity.created(URI.create("/api/v1/products/" + productId + "/order/" + orderId)).build();
    }

    @PostMapping("/api/v1/orders/{orderId}/confirm")
    public ResponseEntity<Void> confirmOrder(
            @AuthMember Member member,
            @PathVariable(value = "orderId") Long orderId
    ) {
        orderService.confirm(member, orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/v1/orders")
    public ResponseEntity<PageInfo<OrderResponse>> findAll(
            @AuthMember Member member,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        return ResponseEntity.ok(orderService.findAll(member, pageToken));
    }
}
