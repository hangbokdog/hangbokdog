package com.ssafy.hangbokdog.product.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.product.domain.Product;
import com.ssafy.hangbokdog.product.dto.response.ProductDetailResponse;
import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final ProductJpaRepository productJpaRepository;

    public Product save(Product product) {
        return productJpaRepository.save(product);
    }

    public PageInfo<ProductResponse> findAll(Long centerId, String pageToken) {
        var data = productJpaRepository.findAll(centerId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, ProductResponse::id);
    }

    public Optional<Product> findById(Long productId) {
        return productJpaRepository.findById(productId);
    }

    public void deleteByIdAndSellerId(Long productId, Long sellerId) {
        productJpaRepository.deleteByIdAndSellerId(productId, sellerId);
    }

    public ProductDetailResponse findDetailById(Long productId) {
        return productJpaRepository.finDetailById(productId);
    }
}
