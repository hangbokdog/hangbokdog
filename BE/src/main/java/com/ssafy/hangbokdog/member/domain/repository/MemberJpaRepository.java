package com.ssafy.hangbokdog.member.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.member.domain.Member;

public interface MemberJpaRepository extends JpaRepository<Member, Long>, MemberQueryRepository {
    Optional<Member> findBySocialId(String socialId);

    boolean existsByNickName(String nickName);

    @Query("""
        SELECT m.fcmToken
        FROM Member m
        WHERE m.id = :id
        """)
    String getFcmTokenById(Long id);
}
