package com.ssafy.hangbokdog.member.dto.response;

import com.ssafy.hangbokdog.common.annotation.Mask;
import com.ssafy.hangbokdog.common.enums.MaskingType;
import com.ssafy.hangbokdog.member.domain.Grade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberSearchNicknameResponse {
    private Long id;
    private String nickName;

    @Mask(type = MaskingType.NAME)
    private String name;

    @Mask(type = MaskingType.PHONE_NUMBER)
    private String phone;

    private int age;
    private Grade grade;
    private String profileImage;
}