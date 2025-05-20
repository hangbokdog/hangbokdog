package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.hangbokdog.member.dto.MemberAgeInfo;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

public interface MemberQueryRepository {

    Optional<MemberSearchNicknameResponse> findByNickname(String nickname);

    List<String> findFcmTokensByCenterId(Long centerId);

    MemberProfileResponse getMemberProfile(Long memberId);

    List<MemberAgeInfo> findByIdWithAge(List<Long> allParticipantIds);

    List<MemberResponse> findMembersInCenter(Long centerId, String pageToken, int pageSize);

    Optional<CenterMemberResponse> findByIdWithCenterInfo(Long memberId, Long centerId);
}
