package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.geolatte.geom.M;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dog.dto.response.MedicalHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogRepository {

	private static final int MEDICAL_PAGE_SIZE = 10;
	private static final int DOG_PAGE_SIZE = 30;

	private final DogJpaRepository dogJpaRepository;
	private final MedicalHistoryJpaRepository medicalHistoryJpaRepository;

	public Dog createDog(Dog dog) {
		return dogJpaRepository.save(dog);
	}

	public DogDetailInfo getDogDetail(Long id, Long centerId) {
		return dogJpaRepository.getDogDetail(id, centerId);
	}

	public boolean existsById(Long id) {
		return dogJpaRepository.existsById(id);
	}

	public Optional<Dog> getDog(Long id) {
		return dogJpaRepository.findById(id);
	}

	public MedicalHistory createMedicalHistory(MedicalHistory medicalHistory) {
		return medicalHistoryJpaRepository.save(medicalHistory);
	}

	public PageInfo<MedicalHistoryResponse> findAllMedicalHistory(
		String pageToken,
		Long dogId
	) {
		var data = medicalHistoryJpaRepository.findAll(
			dogId,
			pageToken,
			MEDICAL_PAGE_SIZE
		);
		return PageInfo.of(data, MEDICAL_PAGE_SIZE, MedicalHistoryResponse::operatedDate);
	}

	public PageInfo<DogSummaryInfo> searchDogs(
		String name,
		DogBreed breed,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		String location,
		Boolean isStar,
		Long centerId,
		String pageToken
	) {
		var data = dogJpaRepository.searchDogs(
			name,
			breed,
			gender,
			start,
			end,
			isNeutered,
			location,
			isStar,
			centerId,
			pageToken,
			DOG_PAGE_SIZE
		);
		return PageInfo.of(data, DOG_PAGE_SIZE, DogSummaryInfo::createdAt);
	}

	public void deleteMedicalHistory(Long id) {
		medicalHistoryJpaRepository.deleteById(id);
	}

	public DogCenterInfo getDogCenterInfo(Long dogId) {
		return dogJpaRepository.getDogCenterInfo(dogId);
	}

	public int getDogCount(Long centerId) {
		return dogJpaRepository.countByCenterId(centerId);
	}

	public List<DogSummaryInfo> getDogSummaries(Long centerId) {
		return dogJpaRepository.getDogSummaries(centerId);
	}

	public int getLocationDogCount(Long locationId) {
		return dogJpaRepository.countByLocationId(locationId);
	}
}
