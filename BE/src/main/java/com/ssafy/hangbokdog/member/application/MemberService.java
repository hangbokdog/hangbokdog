package com.ssafy.hangbokdog.member.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<MemberInfo> findByNickname(String nickname) {
        return memberRepository.findByNickname(nickname);
    }
}
