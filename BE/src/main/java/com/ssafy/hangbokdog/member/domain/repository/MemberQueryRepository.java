package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

public interface MemberQueryRepository {

    List<MemberSearchNicknameResponse> findByNickname(String nickname);

    List<String> findFcmTokensByCenterId(Long centerId);

    MemberProfileResponse getMemberProfile(Long memberId);
}
