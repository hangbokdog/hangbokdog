package com.ssafy.hangbokdog.auth.domain.response;

public record NicknameCheckResponse(
        boolean isDuplicated
) {
    public static NicknameCheckResponse from(boolean isDuplicated) {
        return new NicknameCheckResponse(isDuplicated);
    }
}
