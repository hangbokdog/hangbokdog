package com.ssafy.hangbokdog.member.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.member.domain.Member;

public interface MemberJpaRepository extends JpaRepository<Member, Long>, MemberQueryRepository {
}
