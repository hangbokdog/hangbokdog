package com.ssafy.hangbokdog.common.aop;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.common.annotation.Mask;
import com.ssafy.hangbokdog.common.annotation.MaskApply;
import com.ssafy.hangbokdog.common.dto.MaskingDto;
import com.ssafy.hangbokdog.common.util.MaskingUtil;

import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class MaskingAop {

    @Around("@annotation(maskApply)")
    public Object maskApplyAspect(final ProceedingJoinPoint joinPoint, MaskApply maskApply) throws Throwable {
        Object[] args = joinPoint.getArgs();
        MaskingDto maskingDto = (MaskingDto) args[0];
        Object response = joinPoint.proceed();

        if (maskingDto.getDisableMasking()) {
            return response;
        }

        return applyMasking(maskApply.typeValue(), maskApply.genericTypeValue(), response);
    }

    private static Object applyMasking(Class<?> clazz, Class<?> genericClazz, Object response) throws Exception {
        if (response instanceof List<?>) {
            return applyMaskingForList(genericClazz, (List<?>) response);
        } else {
            return applyMaskingForRecord(clazz, response);
        }
    }

    private static List<?> applyMaskingForList(Class<?> clazz, List<?> list) throws Exception {
        List<Object> maskedList = new ArrayList<>();
        for (Object obj : list) {
            maskedList.add(applyMaskingForRecord(clazz, obj));
        }
        return maskedList;
    }

    private static Object applyMaskingForRecord(Class<?> clazz, Object response) throws Exception {
        Field[] fields = clazz.getDeclaredFields();
        Object maskedObject = clazz.getDeclaredConstructor().newInstance();

        for (Field field : fields) {
            field.setAccessible(true);
            Object fieldValue = field.get(response);

            if (fieldValue instanceof String && field.isAnnotationPresent(Mask.class)) {
                Mask mask = field.getAnnotation(Mask.class);
                fieldValue = MaskingUtil.maskingOf(mask.type(), (String) fieldValue);
            }

            field.set(maskedObject, fieldValue);
        }

        return maskedObject;
    }
}
