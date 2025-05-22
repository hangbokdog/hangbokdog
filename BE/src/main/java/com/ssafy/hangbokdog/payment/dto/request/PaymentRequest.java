package com.ssafy.hangbokdog.payment.dto.request;

public record PaymentRequest(
        String impUid,
        Integer amount
) {
}
