package com.ssafy.hangbokdog.product.dto.request;

public record ProductUpdateRequest(
        String name,
        int price,
        String description
) {
}
