package com.ssafy.hangbokdog.product.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.image.application.S3Service;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.product.application.ProductService;
import com.ssafy.hangbokdog.product.dto.request.ProductCreateRequest;
import com.ssafy.hangbokdog.product.dto.request.ProductUpdateRequest;
import com.ssafy.hangbokdog.product.dto.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final S3Service s3Service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> create(
            @AuthMember Member member,
            @RequestPart(value = "productCreateRequest") ProductCreateRequest productCreateRequest,
            @RequestPart(value = "files") List<MultipartFile> files,
            @RequestParam(name = "centerId") Long centerId
    ) {
        List<String> imageUrls = s3Service.uploadFiles(files);
        Long productId = productService.create(member, productCreateRequest, imageUrls, centerId);

        return ResponseEntity.created(URI.create("/api/v1/products/" + productId)).build();
    }

    @GetMapping
    public ResponseEntity<PageInfo<ProductResponse>> findAll(
            @AuthMember Member member,
            @RequestParam(name = "centerId") Long centerId,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        return ResponseEntity.ok(productService.findAll(member, centerId, pageToken));
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<Void> update(
            @AuthMember Member member,
            @PathVariable(value = "productId") Long productId,
            @RequestPart(value = "productUpdateRequest") ProductUpdateRequest productUpdateRequest,
            @RequestPart(value = "files") List<MultipartFile> files
    ) {
        // TODO : 나중에 고민해보기 (Notion : A103 - 논의할 부분 - 상품 수정)
        List<String> imageUrls = s3Service.uploadFiles(files);
        productService.update(productId, member, productUpdateRequest, imageUrls);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(
            @AuthMember Member member,
            @PathVariable(value = "productId") Long productId
    ) {
        productService.delete(member, productId);
        return ResponseEntity.noContent().build();
    }
}
