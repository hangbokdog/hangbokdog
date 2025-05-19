package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;

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

    public List<MyCenterResponse> getMyCenters(Long memberId) {
        return centerMemberJpaRepository.getMyCenters(memberId);
    }

    public List<CenterSearchInfo> getCentersByName(String name) {
        return centerMemberJpaRepository.searchCentersByName(name);
    }

    public List<CenterMember> getCenterMembersByMemberId(Long memberId) {
        return centerMemberJpaRepository.findByMemberId(memberId);
    }

    public void delete(CenterMember centerMember) {
        centerMemberJpaRepository.delete(centerMember);
    }

    public Boolean existsMainCenter(Long memberId) {
        return centerMemberJpaRepository.existsMainCenter(memberId);
    }

    public CenterMember getMainCenterByMemberId(Long memberId) {
        return centerMemberJpaRepository.getMainCenterByMemberId(memberId);
    }

    public MainCenterResponse getMainCenter(Long memberId) {
        return centerMemberJpaRepository.getMainCenter(memberId);
    }
}
