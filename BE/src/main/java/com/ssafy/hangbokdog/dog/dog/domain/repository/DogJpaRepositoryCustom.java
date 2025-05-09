package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;

public interface DogJpaRepositoryCustom {

	DogDetailInfo getDogDetail(Long id, Long centerId);

	DogCenterInfo getDogCenterInfo(Long id);

	List<DogSummaryInfo> getDogSummaries(Long centerId);

	List<DogSummaryInfo> searchDogs(
		String name,
		DogBreed breed,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		String location,
		Boolean isStar,
		Long centerId,
		String pageToken,
		int pageSize
	);
}
