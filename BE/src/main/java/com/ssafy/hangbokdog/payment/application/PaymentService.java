package com.ssafy.hangbokdog.payment.application;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.Payment;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.payment.domain.PaymentReceipt;
import com.ssafy.hangbokdog.payment.domain.repository.PaymentReceiptRepository;
import com.ssafy.hangbokdog.payment.dto.request.PaymentRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentService {

    private final IamportClient iamportClient;
    private final PaymentReceiptRepository paymentReceiptRepository;

    public void save(PaymentRequest paymentRequest) {
        Payment receivedcPayment;
        try {
            receivedcPayment = iamportClient.paymentByImpUid(paymentRequest.impUid()).getResponse();
        } catch (IamportResponseException | IOException e) {
            throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_PAYMENT);
        }

        if (!receivedcPayment.getImpUid().equals(paymentRequest.impUid())) {
            throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_PAYMENT);
        }

        if (!paymentReceiptRepository.existsByImpUid(paymentRequest.impUid())) {
            throw new BadRequestException(ErrorCode.ALREADY_CHARGED_REQUEST);
        }

        paymentReceiptRepository.save(
                PaymentReceipt.builder()
                        .impUid(receivedcPayment.getImpUid())
                        .merchantUid(receivedcPayment.getMerchantUid())
                        .receiptUrl(receivedcPayment.getReceiptUrl())
                        .amount(receivedcPayment.getAmount())
                        .build()
        );
    }
}
