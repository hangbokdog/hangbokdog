package com.ssafy.hangbokdog.sponsorship.domain.enums;

public enum SponsorShipStatus {
	PENDING,       // 신청
	ACTIVE,        // 활성화된 후원
	COMPLETED,     // 강아지가 입양 또는 사망했을시
	CANCELLED,     // 신청 취소
	SUSPENDED,     // 입보를 가거나 중지시,
	FAILED         // 미납시
}
