package com.ssafy.hangbokdog.order.application;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.CANNOT_PURCHASE_OWN_PRODUCT;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.INSUFFICIENT_BALANCE;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.MILEAGE_NOT_FOUND;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.ORDER_NOT_FOUND;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_FOUND;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_ON_SALE;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.UNAUTHORIZED_ORDER_ACCESS;
import static com.ssafy.hangbokdog.donation.domain.DonationType.PRODUCT_SALE;
import static com.ssafy.hangbokdog.transaction.domain.TransactionType.PURCHASE;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.annotation.RedisLock;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.donation.domain.DonationHistory;
import com.ssafy.hangbokdog.donation.domain.repository.DonationHistoryRepository;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.mileage.domain.Mileage;
import com.ssafy.hangbokdog.mileage.domain.repository.MileageRepository;
import com.ssafy.hangbokdog.order.domain.Order;
import com.ssafy.hangbokdog.order.domain.repository.OrderRepository;
import com.ssafy.hangbokdog.order.dto.OrderResponse;
import com.ssafy.hangbokdog.product.domain.Product;
import com.ssafy.hangbokdog.product.domain.repository.ProductRepository;
import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MileageRepository mileageRepository;
    private final TransactionRepository transactionRepository;
    private final DonationHistoryRepository donationHistoryRepository;

    @RedisLock(key = "'productId:' + #productId")
    public Long order(Member member, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException(PRODUCT_NOT_FOUND));

        if (product.isSeller(member)) {
            throw new BadRequestException(CANNOT_PURCHASE_OWN_PRODUCT);
        }

        if (!product.isOnSale()) {
            throw new BadRequestException(PRODUCT_NOT_ON_SALE);
        }

        Mileage mileage = mileageRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new BadRequestException(MILEAGE_NOT_FOUND));

        Integer ongoingOrdersPrice = orderRepository.getTotalAmountOfOngoingOrderPriceByBuyerId(member.getId());
        if (mileage.getBalance() < product.getPrice() + ongoingOrdersPrice) {
            throw new BadRequestException(INSUFFICIENT_BALANCE);
        }

        product.reserve();

        Order order = Order.builder()
                .buyerId(member.getId())
                .productId(product.getId()).amount(product.getPrice())
                .build();

        return orderRepository.save(order).getId();
    }

    @RedisLock(key = "'productId:' + #productId")
    public void confirm(Member member, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException(ORDER_NOT_FOUND));

        if (!order.isBuyer(member)) {
            throw new BadRequestException(UNAUTHORIZED_ORDER_ACCESS);
        }

        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new BadRequestException(PRODUCT_NOT_FOUND));

        Mileage mileage = mileageRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new BadRequestException(MILEAGE_NOT_FOUND));

        order.confirm();
        mileage.use(order.getAmount());
        product.complete();

        transactionRepository.save(Transaction.builder()
                .type(PURCHASE)
                .amount(order.getAmount())
                .memberId(member.getId())
                .build()
        );

        donationHistoryRepository.save(DonationHistory.builder()
                .donorId(product.getSellerId())
                .amount(order.getAmount())
                .type(PRODUCT_SALE)
                .build()
        );
    }

    public PageInfo<OrderResponse> findAll(Member member, String pageToken) {
        return orderRepository.findAllByBuyerId(member.getId(), pageToken);
    }
}
