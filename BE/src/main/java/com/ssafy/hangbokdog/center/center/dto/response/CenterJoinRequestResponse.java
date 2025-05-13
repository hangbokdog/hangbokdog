package com.ssafy.hangbokdog.center.center.dto.response;

public record CenterJoinRequestResponse(
    Long centerJoinRequestId,
    String name,
    String profileImage
    // TODO : 신청 승인 화면에 유저 정보 어디까지 띄울지 정해야 함.
) {
}
