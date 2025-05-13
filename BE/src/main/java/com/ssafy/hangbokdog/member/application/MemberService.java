package com.ssafy.hangbokdog.member.application;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.annotation.MaskApply;
import com.ssafy.hangbokdog.common.dto.MaskRequest;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.member.dto.request.FcmTokenUpdateRequest;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // TODO: GRADE가 ADMIN인 사용자는 조회되지 않도록 구현이 필요하면 추가
    @MaskApply(
            typeValue        = Optional.class,
            genericTypeValue = MemberSearchNicknameResponse.class
    )
    public MemberSearchNicknameResponse findByNickname(
            MaskRequest maskRequest,
            String nickname
    ) {
        return memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new BadRequestException(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Transactional
    public void saveFcmToken(Long memberId, FcmTokenUpdateRequest request) {
        Member member = getMember(memberId);
        member.updateFcmToken(request.fcmToken());
        member.agreeEmergencyNotification();
    }

    @Transactional
    public void deleteFcmToken(Long memberId) {
        Member member = getMember(memberId);
        member.updateFcmToken(null);
        member.denyEmergencyNotification();
    }

    public MemberProfileResponse getMemberProfile(Long memberId) {
        return memberRepository.getMemberProfile(memberId);
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new BadRequestException((ErrorCode.MEMBER_NOT_FOUND)));
    }
}
