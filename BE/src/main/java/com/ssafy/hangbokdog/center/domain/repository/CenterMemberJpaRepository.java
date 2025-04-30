package com.ssafy.hangbokdog.center.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.domain.CenterMember;

public interface CenterMemberJpaRepository extends JpaRepository<CenterMember, Long> {
    boolean existsByMemberIdAndCenterId(Long memberId, Long centerId);

    Optional<CenterMember> findByMemberIdAndCenterId(Long memberId, Long centerId);
}
