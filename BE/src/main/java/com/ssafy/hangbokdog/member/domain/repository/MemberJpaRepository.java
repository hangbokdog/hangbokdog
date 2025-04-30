package com.ssafy.hangbokdog.member.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.member.domain.Member;

public interface MemberJpaRepository extends JpaRepository<Member, Long>, MemberQueryRepository {
    Optional<Member> findBySocialId(String socialId);

    boolean existsByNickName(String nickName);
}
