package com.ssafy.hangbokdog.product.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.product.domain.Product;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductRepository {

    private final ProductJpaRepository productJpaRepository;

    public Product save(Product product) {
        return productJpaRepository.save(product);
    }
}
