package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

public interface MemberQueryRepository {

    List<MemberInfo> findByNickname(String nickname);
}
