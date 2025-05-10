package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.dto.CenterJoinSearchInfo;
import com.ssafy.hangbokdog.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.dto.response.CenterJoinRequestResponse;

public interface CenterJoinRequestQueryRepository {
    List<CenterJoinRequestResponse> findByCenterId(Long centerId, String pageToken, int pageSize);

    List<CenterJoinSearchInfo> findCenterIdsByMemberId(Long memberId);

    List<AppliedCenterResponse> getAppliedCentersByMemberId(Long memberId);
}
