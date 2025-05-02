package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.CenterJoinRequest;
import com.ssafy.hangbokdog.center.dto.CenterJoinSearchInfo;
import com.ssafy.hangbokdog.center.dto.response.CenterJoinRequestResponse;
import com.ssafy.hangbokdog.common.model.PageInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterJoinRequestRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final CenterJoinRequestJpaRepository centerJoinRequestJpaRepository;

    public boolean existsByMemberIdAndCenterId(Long memberId, Long centerId) {
        return centerJoinRequestJpaRepository.existsByMemberIdAndCenterId(memberId, centerId);
    }

    public CenterJoinRequest save(CenterJoinRequest centerJoinRequest) {
        return centerJoinRequestJpaRepository.save(centerJoinRequest);
    }

    public Optional<CenterJoinRequest> findById(Long centerJoinRequestId) {
        return centerJoinRequestJpaRepository.findById(centerJoinRequestId);
    }

    public void deleteById(Long id) {
        centerJoinRequestJpaRepository.deleteById(id);
    }

    public PageInfo<CenterJoinRequestResponse> findAll(Long centerId, String pageToken) {
        var data = centerJoinRequestJpaRepository.findByCenterId(centerId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, CenterJoinRequestResponse::centerJoinRequestId);
    }

    public List<CenterJoinSearchInfo> findCenterIdsByMemberId(Long memberId) {
        return centerJoinRequestJpaRepository.findCenterIdsByMemberId(memberId);
    }
}
