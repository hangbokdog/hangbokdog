package com.ssafy.hangbokdog.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MaskApply {
    Class<?> typeValue();
    Class<?> genericTypeValue() default Void.class;
}
