package com.ssafy.hangbokdog.product.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

public interface ProductQueryRepository {
    List<ProductResponse> findAll(String pageToken, int pageSize);
}
