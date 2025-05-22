package com.ssafy.hangbokdog.product.dto.response;

import java.util.List;

public record ProductDetailResponse(
        Long id,
        String name,
        List<String> presentationImageUrls,
        int price,
        String description
) {
}
