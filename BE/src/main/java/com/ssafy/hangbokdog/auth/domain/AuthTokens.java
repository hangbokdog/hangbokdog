package com.ssafy.hangbokdog.auth.domain;

public record AuthTokens(
        String refreshToken,
        String accessToken
) {

    public static AuthTokens of(
            String refreshToken,
            String accessToken
    ) {
        return new AuthTokens(refreshToken, accessToken);
    }
}
