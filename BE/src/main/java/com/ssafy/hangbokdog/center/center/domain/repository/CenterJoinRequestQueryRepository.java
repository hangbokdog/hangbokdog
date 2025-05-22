package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.center.dto.CenterJoinSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinRequestResponse;

public interface CenterJoinRequestQueryRepository {
    List<CenterJoinRequestResponse> findByCenterId(Long centerId, String pageToken, int pageSize);

    List<CenterJoinSearchInfo> findCenterIdsByMemberId(Long memberId);

    List<AppliedCenterResponse> getAppliedCentersByMemberId(Long memberId);
}
