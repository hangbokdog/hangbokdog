package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.dto.CenterSearchInfo;

public interface CenterJpaRepositoryCustom {

	List<CenterSearchInfo> getCentersByName(String name);
}
