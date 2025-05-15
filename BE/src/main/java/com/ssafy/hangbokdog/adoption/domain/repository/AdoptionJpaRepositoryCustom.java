package com.ssafy.hangbokdog.adoption.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;

public interface AdoptionJpaRepositoryCustom {
	List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long centerId);

	AdoptedDogDetailInfo getAdoptedDogDetail(Long dogId);

	List<AdoptionApplicationByDogResponse> getAdoptionApplicationsByDogId(Long dogId);
}
