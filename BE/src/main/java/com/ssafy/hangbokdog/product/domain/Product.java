package com.ssafy.hangbokdog.product.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "description")
    private String description;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> imageUrls;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProductStatus status;
}
