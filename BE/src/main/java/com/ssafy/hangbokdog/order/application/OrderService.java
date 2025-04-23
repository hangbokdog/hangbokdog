package com.ssafy.hangbokdog.order.application;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.CANNOT_PURCHASE_OWN_PRODUCT;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_FOUND;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_ON_SALE;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.order.domain.Order;
import com.ssafy.hangbokdog.order.domain.repository.OrderRepository;
import com.ssafy.hangbokdog.product.domain.Product;
import com.ssafy.hangbokdog.product.domain.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    /**
     * 동시 주문, 상품 변경과 경합 가능성 존재
     * Lock Module 구현하고 추가해야 함.
     */
    @Transactional
    public Long order(Member member, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException(PRODUCT_NOT_FOUND));

        if (product.isSeller(member)) {
            throw new BadRequestException(CANNOT_PURCHASE_OWN_PRODUCT);
        }

        if (!product.isOnSale()) {
            throw new BadRequestException(PRODUCT_NOT_ON_SALE);
        }

        product.reserve();

        Order order = Order.builder()
                .buyerId(member.getId())
                .productId(product.getId())
                .build();

        return orderRepository.save(order).getId();
    }
}
