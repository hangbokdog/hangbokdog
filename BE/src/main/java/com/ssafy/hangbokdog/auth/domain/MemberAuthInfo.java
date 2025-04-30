package com.ssafy.hangbokdog.auth.domain;

public record MemberAuthInfo(
        String accessToken,
        String refreshToken,
        boolean isRegistered,
        String name
) {
    public static MemberAuthInfo of(
            String accessToken,
            String refreshToken,
            boolean isRegistered,
            String name
    ) {
        return new MemberAuthInfo(
                accessToken,
                refreshToken,
                isRegistered,
                name
        );
    }
}
