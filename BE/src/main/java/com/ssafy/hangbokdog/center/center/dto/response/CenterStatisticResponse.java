package com.ssafy.hangbokdog.center.center.dto.response;

public record CenterStatisticResponse(
        int totalMemberCount,
        int newMemberCount,
        int volunteerParticipantCount,
        int managerMemberCount,
        int normalMemberCount
) {
    public static CenterStatisticResponse of(
            int totalMemberCount,
            int newMemberCount,
            int volunteerParticipantCount,
            int managerMemberCount,
            int normalMemberCount
    ) {
        return new CenterStatisticResponse(
                totalMemberCount,
                newMemberCount,
                volunteerParticipantCount,
                managerMemberCount,
                normalMemberCount
        );
    }
}
