package com.ssafy.hangbokdog.auth.domain.response;

public record LoginResponse(
        String accessToken,
        boolean isRegistered
) {
    public static LoginResponse of(
            String accessToken,
            boolean isRegistered
    ) {
        return new LoginResponse(
                accessToken,
                isRegistered
        );
    }
}
