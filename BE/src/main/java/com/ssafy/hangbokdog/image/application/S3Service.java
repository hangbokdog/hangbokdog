package com.ssafy.hangbokdog.image.application;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.hangbokdog.image.domain.S3Client;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${cloud.aws.s3.base.url}")
    private String baseUrl;

    private final S3Client s3Client;

    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String uploadFileName = generateFileUrl(file.getOriginalFilename());
            imageUrls.add(s3Client.upload(file, uploadFileName));
        }

        return imageUrls;
    }

    public String uploadFile(MultipartFile file) {
        String uploadFileName = generateFileUrl(file.getOriginalFilename());
        return s3Client.upload(file, uploadFileName);
    }

    public void deleteFile(String imageUrl) {
        s3Client.deleteFile(imageUrl);
    }

    private String generateFileUrl(String fileName) {
        return baseUrl + fileName;
    }
}
