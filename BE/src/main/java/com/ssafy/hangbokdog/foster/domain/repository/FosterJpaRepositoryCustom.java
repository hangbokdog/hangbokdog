package com.ssafy.hangbokdog.foster.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

public interface FosterJpaRepositoryCustom {

	List<MyFosterResponse> findMyFosters(Long memberId);

	List<MyFosterResponse> findMyFosterApplications(Long memberId);

	List<StartedFosterInfo> findAcceptedFosters();

	Integer countDogFosters(Long dogId);

	List<DogFosterResponse> getFostersByDogId(Long dogId);
}
