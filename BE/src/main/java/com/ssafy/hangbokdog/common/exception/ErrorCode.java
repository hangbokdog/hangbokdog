package com.ssafy.hangbokdog.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INVALID_REQUEST(1000, "유효하지 않은 요청입니다."),

    UNABLE_TO_GET_USER_INFO(2001, "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
    UNABLE_TO_GET_ACCESS_TOKEN(2002, "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),

    UNAUTHORIZED_ACCESS(3000, "접근할 수 없는 리소스입니다."),
    INVALID_REFRESH_TOKEN(3001, "유효하지 않은 Refresh Token입니다."),
    FAILED_TO_VALIDATE_TOKEN(3002, "토큰 검증에 실패했습니다."),
    INVALID_ACCESS_TOKEN(3003, "유효하지 않은 Access Token입니다."),

    VALIDATION_FAIL(4000, "유효하지 않은 형식입니다."),
    INTERNAL_SERVER_ERROR(4001, "Internal Server Error"),

    MEMBER_NOT_FOUND(5000, "존재하지 않는 유저입니다."),
    NOT_ADMIN_MEMBER(5001, "관리자가 아닙니다."),
    NOT_MANAGER_MEMBER(5002, "매니저가 아닙니다."),
    NOT_SELLER(5003, "해당 상품의 판매자가 아닙니다."),

    DOG_NOT_FOUND(6000, "존재하지 않는 강아지입니다."),
    FOSTER_APPLICATION_NOT_FOUND(6001, "존재하지 않는 임시보호 요청입니다."),
    FOSTER_ALREADY_PROCESSED(6002, "이미 처리된 임시보호 요청입니다."),
    NOT_VALID_FOSTER_APPLICATION(6003, "유효하지 않은 임시보호 요청입니다."),
    FOSTER_ALREADY_EXISTS(6004, "이미 존재하는 임보 요청입니다."),
    FOSTER_ALREADY_FULL(6005, "이미 임시보호 용량이 꽉찼습니다."),

    PRODUCT_NOT_FOUND(7000, "존재하지 않는 상품입니다."),
    PRODUCT_NOT_ON_SALE(7001, "현재 판매중인 상품이 아닙니다."),
    CANNOT_PURCHASE_OWN_PRODUCT(7002, "내 상품은 구매할 수 없습니다."),

    POST_TYPE_NOT_FOUND(8000, "존재하지 않는 게시판입니다."),
    POST_NOT_FOUND(8001, "존재하지 않는 게시글입니다."),
    NOT_AUTHOR(8002, "해당 게시글의 작성자가 아닙니다."),

    DONATION_ACCOUNT_NOT_FOUND(9000, "존재하지 않는 후원계좌입니다"),

    ORDER_NOT_FOUND(10000, "존재하지 않는 주문입니다."),
    UNAUTHORIZED_ORDER_ACCESS(10001, "해당 상품 주문 유저가 아닙니다."),
    FAILED_TO_ACCESS_PRODUCT(10002, "상품 접근에 실패했습니다."),

    MILEAGE_NOT_FOUND(11000, "존재하지 않는 마일리지입니다."),
    INSUFFICIENT_BALANCE(11001, "잔액이 부족합니다."),

    FAILED_TO_VALIDATE_PAYMENT(12000, "결제 검증에 실패했습니다."),
    ALREADY_CHARGED_REQUEST(12001, "이미 충전됐습니다."),

    COMMENT_NOT_FOUND(13000, "존재하지 않는 댓글입니다."),
    COMMENT_NOT_AUTHOR(13001, "해당 댓글의 작성자가 아닙니다."),
    COMMENT_ALREADY_DELETED(13002, "이미 삭제된 댓글입니다."),

    FULL_SPONSORSHIP(14000, "이미 결연이 가득 찬 아이입니다."),
    SPONSORSHIP_NOT_FOUND(14001, "존재하지 않는 결연입니다"),
    SPONSORSHIP_NOT_AUTHOR(14002, "결연 신청자가 아닙니다."),
    ALREADY_CANCELLED_SPONSORSHIP(14003, "이미 취소된 신청입니다.");

    private final int code;
    private final String message;
}
