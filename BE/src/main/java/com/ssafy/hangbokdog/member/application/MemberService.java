package com.ssafy.hangbokdog.member.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.annotation.MaskApply;
import com.ssafy.hangbokdog.common.dto.MaskRequest;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // TODO: GRADE가 ADMIN인 사용자는 조회되지 않도록 구현이 필요하면 추가
    @MaskApply(
            typeValue        = List.class,
            genericTypeValue = MemberSearchNicknameResponse.class
    )
    public List<MemberSearchNicknameResponse> findByNickname(
            MaskRequest maskRequest,
            String nickname
    ) {
        return memberRepository.findByNickname(nickname);
    }
}
