package com.ssafy.hangbokdog.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.domain.AuthTokens;
import com.ssafy.hangbokdog.auth.util.JwtUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/test-tokens")
public class TokenController {

    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<AuthTokens> issueTestTokens(@RequestParam(name = "id") Long id) {
        return ResponseEntity.ok(jwtUtils.createLoginToken(String.valueOf(id)));
    }
}
