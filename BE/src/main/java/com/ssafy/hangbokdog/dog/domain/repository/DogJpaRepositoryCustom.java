package com.ssafy.hangbokdog.dog.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.DogSummary;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;

public interface DogJpaRepositoryCustom {

	DogDetailResponse getDogDetail(Long id, Long centerId);

	DogCenterInfo getDogCenterInfo(Long id);

	List<DogSummary> getDogSummaries(Long centerId);
}
