package com.ssafy.hangbokdog.product.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.product.domain.Product;

public interface ProductJpaRepository extends JpaRepository<Product, Long>, ProductQueryRepository {
}
