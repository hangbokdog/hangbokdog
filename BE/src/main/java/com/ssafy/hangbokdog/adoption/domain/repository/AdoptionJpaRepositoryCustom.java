package com.ssafy.hangbokdog.adoption.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
import com.ssafy.hangbokdog.adoption.dto.AdoptionSearchInfo;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.adoption.dto.response.MyAdoptionResponse;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public interface AdoptionJpaRepositoryCustom {
	List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long centerId);

	AdoptedDogDetailInfo getAdoptedDogDetail(Long dogId);

	List<AdoptionApplicationByDogResponse> getAdoptionApplicationsByDogId(Long dogId, String name);

	List<AdoptionSearchInfo> search(
		String name,
		Long centerId,
		List<DogBreed> breeds,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		Boolean isStar,
		String pageToken,
		int pageSize
	);

	Boolean checkExist(Long memberId, Long dogId);

	List<MyAdoptionResponse> getMyAdoptions(Long memberId, Long centerId);
}
