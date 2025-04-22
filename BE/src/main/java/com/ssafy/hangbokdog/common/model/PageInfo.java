package com.ssafy.hangbokdog.common.model;

import java.util.List;
import java.util.function.Function;

public record PageInfo<T>(
        String pageToken,
        List<T> data,
        boolean hasNext
) {
    public static <T> PageInfo<T> of(
            List<T> data,
            int expectedSize,
            Function<T, Object> pageTokenFunction
    ) {
        if (data.size() < expectedSize) {
            return new PageInfo<T>(null, data, false);
        }

        var lastValue = data.get(expectedSize - 1);
        var pageToken = pageTokenFunction.apply(lastValue).toString();
        return new PageInfo<T>(pageToken, data.subList(0, expectedSize), true);
    }
}