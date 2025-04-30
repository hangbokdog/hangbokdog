package com.ssafy.hangbokdog.dog.domain.repository;

import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;

public interface DogJpaRepositoryCustom {

	DogDetailResponse getDogDetail(Long id, Long centerId);

	DogCenterInfo getDogCenterInfo(Long id);
}
