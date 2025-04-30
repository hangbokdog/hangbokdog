package com.ssafy.hangbokdog.product.application;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.NOT_SELLER;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_FOUND;
import static com.ssafy.hangbokdog.common.exception.ErrorCode.PRODUCT_NOT_ON_SALE;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.annotation.RedisLock;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.product.domain.Product;
import com.ssafy.hangbokdog.product.domain.repository.ProductRepository;
import com.ssafy.hangbokdog.product.dto.request.ProductCreateRequest;
import com.ssafy.hangbokdog.product.dto.request.ProductUpdateRequest;
import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Long create(
            Member member,
            ProductCreateRequest productCreateRequest,
            List<String> imageUrls,
            Long centerId
    ) {
        Product product = Product.builder()
                .sellerId(member.getId())
                .price(productCreateRequest.price())
                .name(productCreateRequest.name())
                .description(productCreateRequest.description())
                .imageUrls(imageUrls)
                .centerId(centerId)
                .build();

        return productRepository.save(product).getId();
    }

    public PageInfo<ProductResponse> findAll(
            Member member,
            Long centerId,
            String pageToken
    ) {
        return productRepository.findAll(centerId, pageToken);
    }

    @RedisLock(key = "'productId:' + #productId")
    public void update(
            Long productId,
            Member member,
            ProductUpdateRequest productUpdateRequest,
            List<String> imageUrls
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException(PRODUCT_NOT_FOUND));

        if (!product.isSeller(member)) {
            throw new BadRequestException(NOT_SELLER);
        }

        if (!product.isOnSale()) {
            throw new BadRequestException(PRODUCT_NOT_ON_SALE);
        }

        product.update(
                productUpdateRequest.name(),
                productUpdateRequest.description(),
                productUpdateRequest.price(),
                imageUrls
        );
    }

    @RedisLock(key = "'productId:' + #productId")
    public void delete(Member member, Long productId) {
        // TODO: Order 에 관한 변경도 처리
        productRepository.deleteByIdAndSellerId(productId, member.getId());
    }
}
