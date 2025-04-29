package com.ssafy.hangbokdog.member.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;

@Embeddable
@Getter
public class Phone {

    @Column(length = 11, nullable = false)
    private String phone;

    protected Phone() {
    }

    /**
     * 보기 편하게 하이픈 삽입
     * - 10자리 + 02 시작 → 2-4-4
     * - 11자리             → 3-4-4
     */
    public String getFormatted() {
        if (phone.length() == 10 && phone.startsWith("02")) {
            // 02-1234-5678
            return phone.replaceFirst("(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3");
        }
        // 11자리 (010-1234-5678)
        return phone.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
    }

    /**
     * JSON 직렬화 시 사용: 가운데 블록 전체를 '****'로 대체
     * 예: "02-1234-1234" → "02-****-1234"
     *     "010-1234-5678" → "010-****-5678"
     */
    @JsonValue
    public String getMasked() {
        String fmt = getFormatted();
        // 하이픈으로 둘러싸인 중간 숫자 블록을 전부 ****로 교체
        return fmt.replaceAll("-(\\d+)-", "-****-");
    }

    @Override
    public String toString() {
        return getFormatted();
    }
}
