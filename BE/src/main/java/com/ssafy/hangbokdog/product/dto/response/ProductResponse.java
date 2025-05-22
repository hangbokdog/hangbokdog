package com.ssafy.hangbokdog.product.dto.response;

import java.util.List;

/**
 * TODO : 스펙 변경 예정
 */
public record ProductResponse(
        Long id,
        String name,
        List<String> presentationImageUrls,
        int price
) {
}
