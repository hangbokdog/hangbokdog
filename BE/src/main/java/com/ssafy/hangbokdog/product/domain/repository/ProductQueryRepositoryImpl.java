package com.ssafy.hangbokdog.product.domain.repository;

import static com.ssafy.hangbokdog.product.domain.QProduct.product;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.product.domain.ProductStatus;
import com.ssafy.hangbokdog.product.dto.response.ProductDetailResponse;
import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductQueryRepositoryImpl implements ProductQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ProductResponse> findAll(Long centerId, String pageToken, int pageSize) {
        return queryFactory.select(
                Projections.constructor(
                        ProductResponse.class,
                        product.id,
                        product.name,
                        product.imageUrls,
                        product.price
                )).from(product)
                .where(product.centerId.eq(centerId)
                    .and(isInRange(pageToken)))
                .orderBy(product.id.desc())
                .limit(pageSize + 1)
                .fetch();
    }

    @Override
    public ProductDetailResponse finDetailById(Long productId) {
        return queryFactory.select(
                Projections.constructor(
                        ProductDetailResponse.class,
                        product.id,
                        product.name,
                        product.imageUrls,
                        product.price,
                        product.description
                )).from(product)
                .where(product.id.eq(productId))
                .fetchOne();
    }

    @Override
    public List<ProductResponse> searchByWord(String word, String pageToken, int defaultPageSize) {
        return queryFactory.select(
                Projections.constructor(
                        ProductResponse.class,
                        product.id,
                        product.name,
                        product.imageUrls,
                        product.price
                )).from(product)
                .where(product.name.contains(word).and(product.status.eq(ProductStatus.ON_SALE)))
                .orderBy(product.id.desc())
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return product.id.lt(Long.valueOf(pageToken));
    }
}
