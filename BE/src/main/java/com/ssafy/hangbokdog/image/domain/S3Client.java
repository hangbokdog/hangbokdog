package com.ssafy.hangbokdog.image.domain;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3Client {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final AmazonS3 amazonS3;

    public String upload(MultipartFile file, String fileName) {
        String imageUrl;

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(file.getSize());
        objectMetadata.setContentType(file.getContentType());

        try (InputStream inputStream = file.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket,
                    fileName,
                    inputStream,
                    objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            imageUrl = amazonS3.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            throw new IllegalArgumentException("failed to upload");
        }

        log.info("imageUrl : {}", imageUrl);
        return imageUrl;
    }

    public void deleteFile(String imageUrl) {
        DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucket, parseKeyUrl(imageUrl));
        amazonS3.deleteObject(deleteObjectRequest);
    }

    private String parseKeyUrl(String imageUrl) {
        return imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    }
}
