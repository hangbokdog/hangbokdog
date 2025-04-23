package com.ssafy.hangbokdog.member.dto.response;

import com.ssafy.hangbokdog.member.domain.Member;

import lombok.Builder;

@Builder
public record MemberInfo(
        Long id,
        String nickName,
        String grade,
        String profileImage
) {
    public static MemberInfo from(Member member) {
        return MemberInfo.builder()
                .id(member.getId())
                .nickName(member.getNickName())
                .grade(member.getGrade().toString())
                .profileImage(member.getProfileImage())
                .build();
    }
}
