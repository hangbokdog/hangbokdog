package com.ssafy.hangbokdog.member.dto.response;

import com.ssafy.hangbokdog.common.model.PageInfo;

public record CenterMemberPageResponseWithCount(
        PageInfo<MemberResponse> memberResponses,
        int count
) {
    public static CenterMemberPageResponseWithCount of(PageInfo<MemberResponse> pageData, int count) {
        return new CenterMemberPageResponseWithCount(pageData, count);
    }
}
