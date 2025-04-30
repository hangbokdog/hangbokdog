package com.ssafy.hangbokdog.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.ssafy.hangbokdog.common.enums.MaskingType;

public class MaskingUtil {

    public static String maskingOf(MaskingType type, String value) {
        return switch (type) {
            case NAME -> nameMaskOf(value);
            case PHONE_NUMBER -> phoneNumberMaskOf(value);
        };
    }

    private static String nameMaskOf(String value) {
        if (value == null || value.length() < 2) {
            return value; // 마스킹 불가능
        }
        if (value.length() == 2) {
            // 두 글자면 두 번째 글자만 마스킹
            return value.charAt(0) + "*";
        }
        // 세 글자 이상이면 중간 문자들 마스킹
        String regex = "(?<=.{1})(.*)(?=.$)";
        return value.replaceFirst(
                regex,
                "*".repeat(value.length() - 2)
        );
    }

    private static String phoneNumberMaskOf(String value) {
        // 2~3자리 - 3~4자리 - 4자리 형태, 입력에 하이픈이 없어도 매칭
        Pattern p = Pattern.compile("(\\d{2,3})-?(\\d{3,4})-?(\\d{4})$");
        Matcher m = p.matcher(value);
        if (m.find()) {
            String part1 = m.group(1);
            String part2 = m.group(2);
            String part3 = m.group(3);

            // 중간 부분만 별표로 대체
            String maskedMid = "*".repeat(part2.length());

            // 마스킹된 앞뒤에 하이픈을 추가
            return part1 + "-" + maskedMid + "-" + part3;
        }
        return value;
    }
}
