package com.ssafy.hangbokdog.auth.domain.request;

import java.time.LocalDate;

public record SignUpRequest(
        String name,
        String nickname,
        LocalDate birth,
        int age,
        String description
) {
}
