package com.ssafy.hangbokdog.product.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.product.domain.Product;

public interface ProductJpaRepository extends JpaRepository<Product, Long>, ProductQueryRepository {

    @Modifying
    @Query("UPDATE Product p SET p.deleted = true WHERE p.id = :id")
    void deleteById(Long id);
}
