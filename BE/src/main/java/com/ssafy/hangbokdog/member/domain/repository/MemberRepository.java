package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberRepository {
    private final MemberJpaRepository memberJpaRepository;

    public Optional<Member> findById(Long id) {
        return memberJpaRepository.findById(id);
    }

    public List<MemberInfo> findByNickname(String nickname) {
        return memberJpaRepository.findByNickname(nickname);
    }
}
