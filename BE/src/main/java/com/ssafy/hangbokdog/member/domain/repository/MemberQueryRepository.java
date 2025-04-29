package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

public interface MemberQueryRepository {

    List<MemberSearchNicknameResponse> findByNickname(String nickname);
}
