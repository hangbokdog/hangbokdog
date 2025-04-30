package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.domain.CenterJoinRequest;

public interface CenterJoinRequestJpaRepository
        extends JpaRepository<CenterJoinRequest, Long>, CenterJoinRequestQueryRepository {
    boolean existsByMemberIdAndCenterId(Long memberId, Long centerId);
}
