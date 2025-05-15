package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dog.dto.response.HospitalDogResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;

public interface DogJpaRepositoryCustom {

	DogDetailInfo getDogDetail(Long id, Long centerId);

	DogCenterInfo getDogCenterInfo(Long id);

	List<DogSummaryInfo> getDogSummaries(Long centerId);

	List<DogSummaryInfo> searchDogs(
		String name,
		List<DogBreed> breed,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		List<Long> locationIds,
		Boolean isStar,
		Long centerId,
		String pageToken,
		int pageSize
	);

	List<DogSummaryInfo> searchAdoptedDogs(
		String name,
		List<DogBreed> breed,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		List<Long> locationIds,
		Boolean isStar,
		Long centerId,
		String pageToken,
		int pageSize
	);

	List<VaccinationDoneResponse> getNotVaccinatedDogs(
		List<Long> dogIds,
		String keyword,
		List<Long> locationIds,
		String pageToken,
		int pageSize
	);

	List<HospitalDogResponse> getHospitalDogs(Long centerId, String pageToken, int pageSize);
}
