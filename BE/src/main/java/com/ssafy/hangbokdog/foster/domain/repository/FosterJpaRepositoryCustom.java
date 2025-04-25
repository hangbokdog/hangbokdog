package com.ssafy.hangbokdog.foster.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

public interface FosterJpaRepositoryCustom {

	List<MyFosterResponse> findMyFosters(Long memberId);

	List<MyFosterResponse> findMyFosterApplications(Long memberId);

	Integer countDogFosters(Long dogId);
}
