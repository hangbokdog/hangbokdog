package com.ssafy.hangbokdog.auth.presentation;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.auth.application.LoginService;
import com.ssafy.hangbokdog.auth.domain.request.LoginRequest;
import com.ssafy.hangbokdog.auth.domain.request.SignUpRequest;
import com.ssafy.hangbokdog.auth.domain.response.AccessTokenResponse;
import com.ssafy.hangbokdog.auth.domain.response.LoginResponse;
import com.ssafy.hangbokdog.auth.domain.response.NicknameCheckResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class LoginController {

    private static final int ONE_WEEK_SECONDS = 604800;

    private final LoginService loginService;

    @PostMapping(value = "/login/naver")
    public ResponseEntity<LoginResponse> naverLogin(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        var loginResponse = loginService.login(loginRequest);

        ResponseCookie cookie = ResponseCookie.from("refresh-token", loginResponse.refreshToken())
                .maxAge(ONE_WEEK_SECONDS)
                .secure(true)
                .httpOnly(true)
                .sameSite("None")
                .domain("k12a103.p.ssafy.io")
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(
                LoginResponse.of(
                        loginResponse.accessToken(),
                        loginResponse.isRegistered(),
                        loginResponse.name()
                )
        );
    }

    @PostMapping("/reissue")
    public ResponseEntity<AccessTokenResponse> reissueToken(
            @CookieValue("refresh-token") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) {
        String reissuedToken = loginService.reissueAccessToken(refreshToken, authHeader);
        return ResponseEntity.ok(new AccessTokenResponse(reissuedToken));
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<Void> logout(
            @CookieValue("refresh-token") String refreshToken
    ) {
        loginService.logout(refreshToken);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(
            @AuthMember Member member,
            @RequestBody SignUpRequest signUpRequest
    ) {
        loginService.signUp(member, signUpRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/duplicate-check")
    public ResponseEntity<NicknameCheckResponse> check(
            @AuthMember Member member,
            @RequestParam String nickname
    ) {
        return ResponseEntity.ok(loginService.checkNickname(member, nickname));
    }
}
