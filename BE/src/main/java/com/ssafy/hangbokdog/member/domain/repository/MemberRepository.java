package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberRepository {
    private final MemberJpaRepository memberJpaRepository;

    public Optional<Member> findById(Long id) {
        return memberJpaRepository.findById(id);
    }

    public List<MemberSearchNicknameResponse> findByNickname(String nickname) {
        return memberJpaRepository.findByNickname(nickname);
    }

    public Optional<Member> findBySocialId(String socialId) {
        return memberJpaRepository.findBySocialId(socialId);
    }

    public Member save(Member member) {
        return memberJpaRepository.save(member);
    }

    public boolean existsByNickName(String nickName) {
        return memberJpaRepository.existsByNickName(nickName);
    }
}
