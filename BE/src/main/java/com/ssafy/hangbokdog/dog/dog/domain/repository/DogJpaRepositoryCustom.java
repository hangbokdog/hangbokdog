package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;

public interface DogJpaRepositoryCustom {

	DogDetailInfo getDogDetail(Long id, Long centerId);

	DogCenterInfo getDogCenterInfo(Long id);

	List<DogSummaryInfo> getDogSummaries(Long centerId);
}
