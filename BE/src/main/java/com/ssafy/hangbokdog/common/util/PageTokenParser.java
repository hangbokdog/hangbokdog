package com.ssafy.hangbokdog.common.util;

import org.apache.commons.lang3.tuple.Pair;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;

public class PageTokenParser {

    private static final String DELIMITER = "@";

    public static Pair<String, String> parsePageToken(String pageToken) {
        if (pageToken == null || !pageToken.contains(DELIMITER)) {
            throw new BadRequestException(ErrorCode.FAILED_TO_PARSE_TOKEN);
        }

        String[] tokens = pageToken.split("\\@", 2);
        if (tokens.length != 2) {
            throw new BadRequestException(ErrorCode.FAILED_TO_PARSE_TOKEN);
        }

        return Pair.of(tokens[0], tokens[1]);
    }
}
