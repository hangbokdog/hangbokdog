package com.ssafy.hangbokdog.mileage.domain.repository;

import java.util.Map;

public interface MileageJpaRepositoryCustom {

	void updateBulkMileage(Map<Long, Long> memberDeductions);
}
