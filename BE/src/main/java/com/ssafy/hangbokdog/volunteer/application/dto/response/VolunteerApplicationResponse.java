package com.ssafy.hangbokdog.volunteer.application.dto.response;

import java.util.List;

public record VolunteerApplicationResponse(
        List<MemberApplicationInfo> memberApplicationInfo,
        int count
) {
    public static VolunteerApplicationResponse from(List<MemberApplicationInfo> memberApplicationInfos) {
        return new VolunteerApplicationResponse(
                memberApplicationInfos,
                memberApplicationInfos.size()
        );
    }
}
