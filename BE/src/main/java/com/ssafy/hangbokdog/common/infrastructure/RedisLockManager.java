package com.ssafy.hangbokdog.common.infrastructure;

import java.time.Duration;
import java.util.Collections;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisLockManager {

    private static final String LOCK_REMOVE_SCRIPT =
                """
                if redis.call('get', KEYS[1]) == ARGV[1] then
                    return redis.call('del', KEYS[1])
                else
                    return 0;
                end
                """;

    private static final ThreadLocal<String> lockValueHolder = new ThreadLocal<>();

    private final RedisTemplate<String, Object> redisTemplate;

    public boolean tryLock(String key, long leaseTime) {
        String value = UUID.randomUUID().toString();
        Boolean isSuccess = redisTemplate.opsForValue().setIfAbsent(
                key,
                value,
                Duration.ofMillis(leaseTime)
        );

        if (isSuccess) {
            lockValueHolder.set(value);
        }

        return isSuccess;
    }

    public void unLock(String key) {
        String value = lockValueHolder.get();
        if (value == null) {
            return;
        }

        redisTemplate.execute(
                new DefaultRedisScript<>(LOCK_REMOVE_SCRIPT, long.class),
                Collections.singletonList(key),
                value
        );

        lockValueHolder.remove();
    }
}
