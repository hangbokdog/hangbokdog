package com.ssafy.hangbokdog.auth.domain.request;

import java.time.LocalDate;

public record SignUpRequest(
        String name,
        String nickname,
        String phone,
        LocalDate birth
) {
}
