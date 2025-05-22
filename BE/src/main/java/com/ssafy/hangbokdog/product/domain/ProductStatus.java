package com.ssafy.hangbokdog.product.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum ProductStatus {
    ON_SALE,
    PENDING,
    SOLD_OUT
}
