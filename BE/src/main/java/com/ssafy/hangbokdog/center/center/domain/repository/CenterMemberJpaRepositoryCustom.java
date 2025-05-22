package com.ssafy.hangbokdog.center.center.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;

public interface CenterMemberJpaRepositoryCustom {

	List<MyCenterResponse> getMyCenters(Long memberId);

	List<CenterSearchInfo> searchCentersByName(String name);

	Boolean existsMainCenter(Long memberId);

	MainCenterResponse getMainCenter(Long memberId);

	int getTotalMemberCountInCenter(Long centerId);

	int getCenterMemberCountAfterTime(Long centerId, LocalDateTime monthAgo);

	int getMemberCountByCenterIdAndGrade(Long centerId, CenterGrade centerGrade);
}
