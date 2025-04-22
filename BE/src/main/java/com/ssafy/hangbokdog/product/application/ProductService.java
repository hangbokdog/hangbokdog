package com.ssafy.hangbokdog.product.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.product.domain.Product;
import com.ssafy.hangbokdog.product.domain.repository.ProductRepository;
import com.ssafy.hangbokdog.product.dto.request.ProductCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Long create(
            Member member,
            ProductCreateRequest productCreateRequest,
            List<String> imageUrls
    ) {
        Product product = Product.builder()
                .sellerId(member.getId())
                .price(productCreateRequest.price())
                .name(productCreateRequest.name())
                .description(productCreateRequest.description())
                .imageUrls(imageUrls)
                .build();

        return productRepository.save(product).getId();
    }
}
