package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.dto.response.CenterNameResponse;

public interface CenterMemberJpaRepositoryCustom {

	List<CenterNameResponse> getMyCenters(Long memberId);
}
