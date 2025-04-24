package com.ssafy.hangbokdog.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.siot.IamportRestClient.IamportClient;

@Configuration
public class PaymentConfig {

    @Value("${iamport.key}")
    private String key;

    @Value("${iamport.secret}")
    private String secret;

    @Bean
    public IamportClient iamportClient() {
        return new IamportClient(key, secret);
    }
}
