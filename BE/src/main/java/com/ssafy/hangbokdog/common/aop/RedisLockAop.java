package com.ssafy.hangbokdog.common.aop;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.FAILED_TO_ACCESS_PRODUCT;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.common.annotation.RedisLock;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.infrastructure.RedisLockManager;
import com.ssafy.hangbokdog.common.tx.TransactionFacade;
import com.ssafy.hangbokdog.common.util.CSpringExpressionParser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RedisLockAop {

    private static final String REDIS_LOCK_PREFIX = "LOCK:";

    private final RedisLockManager redisLockManager;
    private final TransactionFacade transactionFacade;

    /**
     * Spec : Lock 획득 실패시 바로 Return (SpinLock X)
     */
    @Around("@annotation(com.ssafy.hangbokdog.common.annotation.RedisLock)")
    public Object lock(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RedisLock lock = method.getAnnotation(RedisLock.class);

        long leaseTime = lock.leaseTime();

        String key = REDIS_LOCK_PREFIX + CSpringExpressionParser.getDynamicValue(
                signature.getParameterNames(),
                joinPoint.getArgs(),
                lock.key()
        );

        try {
            boolean available = redisLockManager.tryLock(key, leaseTime);
            if (!available) {
                throw new BadRequestException(FAILED_TO_ACCESS_PRODUCT);
            }
            return transactionFacade.proceed(joinPoint);
        } catch (Exception e) {
            throw e;
        } finally {
            redisLockManager.unLock(key);
        }
    }
}

