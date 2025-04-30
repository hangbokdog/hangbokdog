package com.ssafy.hangbokdog.center.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.CenterMember;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterMemberRepository {

    private final CenterMemberJpaRepository centerMemberJpaRepository;

    public CenterMember save(CenterMember centerMember) {
        return centerMemberJpaRepository.save(centerMember);
    }

    public boolean existsByMemberIdAndCenterId(Long memberId, Long centerId) {
        return centerMemberJpaRepository.existsByMemberIdAndCenterId(memberId, centerId);

    }

    public Optional<CenterMember> findByMemberIdAndCenterId(Long memberId, Long centerId) {
        return centerMemberJpaRepository.findByMemberIdAndCenterId(memberId, centerId);
    }
}
