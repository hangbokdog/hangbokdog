package com.ssafy.hangbokdog.member.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.annotation.MaskApply;
import com.ssafy.hangbokdog.common.dto.MaskRequest;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.member.dto.request.FcmTokenUpdateRequest;
import com.ssafy.hangbokdog.member.dto.request.MemberUpdateRequest;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberPageResponseWithCount;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final CenterMemberRepository centerMemberRepository;

    // TODO: GRADE가 ADMIN인 사용자는 조회되지 않도록 구현이 필요하면 추가
    @MaskApply(
            typeValue        = MemberSearchNicknameResponse.class,
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

    @Transactional
    public void updateProfile(Long memberId, MemberUpdateRequest request, String imageUrl) {
        Member member = getMember(memberId);
        if (imageUrl == null) {
            imageUrl = member.getProfileImage();
        }
        member.updateProfile(request.nickName(), imageUrl);
    }

    public MemberProfileResponse getMemberProfile(Long memberId) {
        return memberRepository.getMemberProfile(memberId);
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new BadRequestException((ErrorCode.MEMBER_NOT_FOUND)));
    }

    public CenterMemberPageResponseWithCount findMembersInCenter(
            Long centerId,
            Member member,
            String pageToken,
            CenterGrade grade,
            String searchWord
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        return memberRepository.findMembersInCenter(centerId, pageToken, grade, searchWord);
    }

    public CenterMemberResponse findCenterMember(Long memberId, Member member, Long centerId) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        return memberRepository.findByIdWithCenterInfo(memberId, centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
    }
}
