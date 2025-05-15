package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;

public interface CenterJpaRepositoryCustom {

	List<CenterSearchInfo> getCentersByName(String name, CenterCity centerCity);
}
