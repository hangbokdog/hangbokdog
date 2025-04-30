package com.ssafy.hangbokdog.auth.domain.response;

public record LoginResponse(
        String accessToken,
        boolean isRegistered,
        String name
) {
    public static LoginResponse of(
            String accessToken,
            boolean isRegistered,
            String name
    ) {
        return new LoginResponse(
                accessToken,
                isRegistered,
                name
        );
    }
}
