package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterSearchResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;

import com.ssafy.hangbokdog.common.model.PageInfo;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterMemberRepository {

    private static final int CENTER_MEMBER_PAGE_SIZE = 20;

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

    public PageInfo<CenterMemberResponse> getCenterMembers(
        Long centerId,
        String keyword,
        CenterGrade grade,
        String pageToken
    ) {
        var data = centerMemberJpaRepository.getCenterMembers(
            centerId,
            keyword,
            grade,
            pageToken,
            CENTER_MEMBER_PAGE_SIZE
        );
        return PageInfo.of(data, CENTER_MEMBER_PAGE_SIZE, CenterMemberResponse::centerMemberId);
    }
}
