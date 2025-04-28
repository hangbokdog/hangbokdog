package com.ssafy.hangbokdog.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
public enum Grade {
    ADMIN, MANAGER, USER
}
