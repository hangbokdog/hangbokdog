package com.ssafy.hangbokdog.auth.domain;

public record MemberAuthInfo(
        String accessToken,
        String refreshToken,
        boolean isRegistered
) {
    public static MemberAuthInfo of(
            String accessToken,
            String refreshToken,
            boolean isRegistered
    ) {
        return new MemberAuthInfo(
                accessToken,
                refreshToken,
                isRegistered
        );
    }
}
