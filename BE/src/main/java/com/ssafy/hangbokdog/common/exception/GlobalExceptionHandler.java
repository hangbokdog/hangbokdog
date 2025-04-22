package com.ssafy.hangbokdog.common.exception;

import java.util.Objects;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        log.warn(exception.getMessage(), exception);
        String message = Objects.requireNonNull(exception.getBindingResult().getFieldError())
                .getDefaultMessage();

        return ResponseEntity.badRequest()
                .body(new ExceptionResponse(ErrorCode.INVALID_REQUEST.getCode(), message));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ExceptionResponse> handleBadRequestException(BadRequestException exception) {
        log.warn(exception.getMessage(), exception);

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ExceptionResponse(exception.getCode(), exception.getMessage()));
    }
}
