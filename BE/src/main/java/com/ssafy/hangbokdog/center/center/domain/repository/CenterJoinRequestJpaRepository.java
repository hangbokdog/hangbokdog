package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.center.domain.CenterJoinRequest;

public interface CenterJoinRequestJpaRepository
        extends JpaRepository<CenterJoinRequest, Long>, CenterJoinRequestQueryRepository {
    boolean existsByMemberIdAndCenterId(Long memberId, Long centerId);

	List<CenterJoinRequest> findByMemberId(Long memberId);
}
