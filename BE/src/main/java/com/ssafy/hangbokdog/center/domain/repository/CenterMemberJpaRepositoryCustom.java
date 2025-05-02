package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.dto.response.MyCenterResponse;

public interface CenterMemberJpaRepositoryCustom {

	List<MyCenterResponse> getMyCenters(Long memberId);

	List<CenterSearchInfo> searchCentersByName(String name);
}
