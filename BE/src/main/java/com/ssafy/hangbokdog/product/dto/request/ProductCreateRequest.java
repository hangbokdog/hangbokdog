package com.ssafy.hangbokdog.product.dto.request;

public record ProductCreateRequest(
        String name,
        int price,
        String description
) {
}
