package com.ssafy.hangbokdog.product.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.product.dto.response.ProductDetailResponse;
import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

public interface ProductQueryRepository {
    List<ProductResponse> findAll(Long centerId, String pageToken, int pageSize);

    ProductDetailResponse finDetailById(Long productId);
}
