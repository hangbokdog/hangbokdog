package com.ssafy.hangbokdog.volunteer.application.domain;

public enum VolunteerApplicationStatus {
    PENDING,    // 대기중
    APPROVED,   // 승인
    REJECTED,   // 거부
    NONE        // Center 회원이 아닌 경우
}
