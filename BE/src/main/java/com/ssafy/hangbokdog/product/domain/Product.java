package com.ssafy.hangbokdog.product.domain;

import static com.ssafy.hangbokdog.product.domain.ProductStatus.ON_SALE;
import static com.ssafy.hangbokdog.product.domain.ProductStatus.PENDING;
import static com.ssafy.hangbokdog.product.domain.ProductStatus.SOLD_OUT;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.member.domain.Member;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted = false")
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

    @Column(name = "deleted")
    private boolean deleted;

    @Column(name = "center_id", nullable = false)
    private Long centerId;

    @Builder
    public Product(
            Long sellerId,
            String name,
            int price,
            String description,
            List<String> imageUrls,
            Long centerId
    ) {
        this.sellerId = sellerId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrls = imageUrls;
        this.status = ON_SALE;
        this.deleted = false;
        this.centerId = centerId;
    }

    public boolean isSeller(Member seller) {
        return seller.getId().equals(sellerId);
    }

    public boolean isOnSale() {
        return status.equals(ON_SALE);
    }

    public void update(
            String name,
            String description,
            int price,
            List<String> imageUrls
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrls = imageUrls;
    }

    public void reserve() {
        status = PENDING;
    }

    public void complete() {
        status = SOLD_OUT;
    }
}
