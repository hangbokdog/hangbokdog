package com.ssafy.hangbokdog.member.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.hangbokdog.member.domain.Grade;
import com.ssafy.hangbokdog.member.domain.Phone;

public record MemberSearchNicknameResponse(
        Long id,
        String nickName,
        String name,
        Phone phone,
        int age,
        Grade grade,
        String profileImage
) {
    @JsonProperty("name")
    public String name() {
        if (name.length() == 2) {
            // 외자면 두 번째 글자만 *
            return name.charAt(0) + "*";
        }
        // 3글자 이상은 정규식 마스킹
        return name.replaceAll("(?<=^.).(?=.*.$)", "*");
    }
}
