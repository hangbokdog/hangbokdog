package com.ssafy.hangbokdog.auth.infrastructure;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class NaverOAuthProvider {

    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUrl;
    private final String tokenUri;
    private final String userInfoUri;

    public NaverOAuthProvider(
            RestTemplate restTemplate,
            @Value("${spring.security.oauth2.client.registration.naver.client-id}")
            String clientId,
            @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
            String clientSecret,
            @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
            String redirectUrl,
            @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
            String tokenUri,
            @Value("${spring.security.oauth2.client.provider.naver.user-info-uri}")
            String userInfoUri
    ) {
        this.restTemplate = restTemplate;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.tokenUri = tokenUri;
        this.userInfoUri = userInfoUri;
    }

    public NaverMemberInfo getMemberInfo(String naverAccessToken) {
        log.info("access_token : {}", naverAccessToken);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(naverAccessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, Boolean> params = new HashMap<>();

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<NaverMemberInfo> response = restTemplate.exchange(
                userInfoUri,
                HttpMethod.GET,
                requestEntity,
                NaverMemberInfo.class,
                params
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("response : {}", response.getBody().toString());
            return response.getBody();
        }

        throw new BadRequestException(ErrorCode.UNABLE_TO_GET_USER_INFO);
    }

    public String fetchNaverAccessToken(String code, String state) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

        params.add("code", code);
        params.add("state", state);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUrl);
        params.add("grant_type", "authorization_code");
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        ResponseEntity<NaverTokenResponse> response = restTemplate.exchange(
                tokenUri,
                HttpMethod.POST,
                requestEntity,
                NaverTokenResponse.class
        );

        return Optional.ofNullable(response.getBody())
                .orElseThrow(() -> new BadRequestException(ErrorCode.UNABLE_TO_GET_ACCESS_TOKEN))
                .getAccessToken();
    }

    @Getter
    public static class NaverTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("refresh_token")
        private String refreshToken;

        @JsonProperty("expires_in")
        private Integer expiresIn;

        @JsonProperty("token_type")
        private String tokenType;
    }
}
