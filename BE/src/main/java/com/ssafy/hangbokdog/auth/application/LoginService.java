package com.ssafy.hangbokdog.auth.application;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.auth.domain.AuthTokens;
import com.ssafy.hangbokdog.auth.domain.MemberAuthInfo;
import com.ssafy.hangbokdog.auth.domain.RefreshToken;
import com.ssafy.hangbokdog.auth.domain.repository.RefreshTokenRepository;
import com.ssafy.hangbokdog.auth.domain.request.LoginRequest;
import com.ssafy.hangbokdog.auth.domain.request.SignUpRequest;
import com.ssafy.hangbokdog.auth.domain.response.NicknameCheckResponse;
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

    public MemberAuthInfo login(LoginRequest loginRequest) {
        String naverAccessToken = naverOAuthProvider.fetchNaverAccessToken(
                loginRequest.getCode(),
                loginRequest.getState()
        );
        NaverMemberInfo memberInfo = naverOAuthProvider.getMemberInfo(naverAccessToken);

        Member member = findOrCreateMember(
                memberInfo.getSocialId(),
                memberInfo.getProfileImageUrl(),
                memberInfo.getEmail(),
                memberInfo.getName()
        );

        AuthTokens authTokens = jwtUtils.createLoginToken(member.getId().toString());
        RefreshToken refreshToken = new RefreshToken(member.getId(), authTokens.refreshToken());
        refreshTokenRepository.save(refreshToken);
        return MemberAuthInfo.of(
                authTokens.accessToken(),
                authTokens.refreshToken(),
                !member.isGuest(),
                member.getName()
        );
    }

    private Member findOrCreateMember(
            String socialLoginId,
            String profileImageUrl,
            String email,
            String name
    ) {
        return memberRepository.findBySocialId(socialLoginId)
                .orElseGet(() -> createMember(socialLoginId, profileImageUrl, email, name));
    }

    private Member createMember(
            String socialLoginId,
            String profileImageUrl,
            String email,
            String name
    ) {
        return memberRepository.save(
                Member.builder()
                        .socialId(socialLoginId)
                        .nickName(UUID.randomUUID().toString())
                        .profileImage(profileImageUrl)
                        .email(email)
                        .name(name)
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

    @Transactional
    public void signUp(Member member, SignUpRequest signUpRequest) {
        Member signUpMember = memberRepository.findById(member.getId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.MEMBER_NOT_FOUND));

        if (!signUpMember.isGuest()) {
            throw new BadRequestException(ErrorCode.ALREADY_REGISTERED_MEMBER);
        }

        signUpMember.signUp(
                signUpRequest.name(),
                signUpRequest.nickname(),
                signUpRequest.phone(),
                signUpRequest.birth(),
                LocalDate.now().getYear() - signUpRequest.birth().getYear()
        );
    }

    public NicknameCheckResponse checkNickname(Member member, String nickName) {
        return NicknameCheckResponse.from(memberRepository.existsByNickName(nickName));
    }
}
