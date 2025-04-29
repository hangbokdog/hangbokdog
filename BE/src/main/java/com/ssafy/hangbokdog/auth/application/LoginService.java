package com.ssafy.hangbokdog.auth.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.auth.domain.AuthTokens;
import com.ssafy.hangbokdog.auth.domain.RefreshToken;
import com.ssafy.hangbokdog.auth.domain.repository.RefreshTokenRepository;
import com.ssafy.hangbokdog.auth.domain.request.LoginRequest;
import com.ssafy.hangbokdog.auth.infrastructure.NaverMemberInfo;
import com.ssafy.hangbokdog.auth.infrastructure.NaverOAuthProvider;
import com.ssafy.hangbokdog.auth.util.JwtUtils;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;
    private final NaverOAuthProvider naverOAuthProvider;

    public AuthTokens login(LoginRequest loginRequest) {
        String naverAccessToken = naverOAuthProvider.fetchNaverAccessToken(
                loginRequest.getCode(),
                loginRequest.getState()
        );
        NaverMemberInfo memberInfo = naverOAuthProvider.getMemberInfo(naverAccessToken);

        Member member = findOrCreateMember(
                memberInfo.getSocialId(),
                memberInfo.getNickname(),
                memberInfo.getProfileImageUrl(),
                memberInfo.getEmail()
        );

        AuthTokens authTokens = jwtUtils.createLoginToken(member.getId().toString());
        RefreshToken refreshToken = new RefreshToken(member.getId(), authTokens.refreshToken());
        refreshTokenRepository.save(refreshToken);
        return authTokens;
    }

    private Member findOrCreateMember(
            String socialLoginId,
            String nickname,
            String profileImageUrl,
            String email
    ) {
        return memberRepository.findBySocialId(socialLoginId)
                .orElseGet(() -> createMember(socialLoginId, nickname, profileImageUrl, email));
    }

    private Member createMember(
            String socialLoginId,
            String nickname,
            String profileImageUrl,
            String email
    ) {
        return memberRepository.save(
                Member.builder()
                        .socialId(socialLoginId)
                        .nickName(nickname)
                        .profileImage(profileImageUrl)
                        .email(email)
                        .build()
        );
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.deleteById(refreshToken);
    }

    public String reissueAccessToken(String refreshToken, String authHeader) {
        String accessToken = authHeader.split(" ")[1];

        jwtUtils.validateRefreshToken(refreshToken);
        if (jwtUtils.isAccessTokenValid(accessToken)) {
            return accessToken;
        }

        if (jwtUtils.isAccessTokenExpired(accessToken)) {
            RefreshToken foundRefreshToken = refreshTokenRepository.findById(refreshToken)
                    .orElseThrow(() -> new BadRequestException(ErrorCode.INVALID_REFRESH_TOKEN));
            return jwtUtils.reissueAccessToken(foundRefreshToken.getUserId().toString());
        }

        throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_TOKEN);
    }
}
