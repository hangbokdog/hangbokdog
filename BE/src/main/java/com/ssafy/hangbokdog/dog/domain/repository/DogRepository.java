package com.ssafy.hangbokdog.dog.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dto.DogSummary;
import com.ssafy.hangbokdog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dto.response.MedicalHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogRepository {

	private static final int DEFAULT_PAGE_SIZE = 10;

	private final DogJpaRepository dogJpaRepository;
	private final DogJpaRepositoryCustomImpl dogJpaRepositoryCustomImpl;
	private final MedicalHistoryJpaRepository medicalHistoryJpaRepository;
	private final MedicalHistoryJpaRepositoryCustomImpl medicalHistoryJpaRepositoryCustomImpl;

	public Dog createDog(Dog dog) {
		return dogJpaRepository.save(dog);
	}

	public DogDetailInfo getDogDetail(Long id, Long centerId) {
		return dogJpaRepositoryCustomImpl.getDogDetail(id, centerId);
	}

	public boolean existsById(Long id) {
		return dogJpaRepository.existsById(id);
	}

	public Optional<Dog> getDog(Long id) {
		return dogJpaRepository.findById(id);
	}

	public boolean checkDogExistence(Long id) {
		return dogJpaRepository.existsById(id);
	}

	public MedicalHistory createMedicalHistory(MedicalHistory medicalHistory) {
		return medicalHistoryJpaRepository.save(medicalHistory);
	}

	public PageInfo<MedicalHistoryResponse> findAllMedicalHistory(
		String pageToken,
		Long dogId
	) {
		var data = medicalHistoryJpaRepositoryCustomImpl.findAll(
			dogId,
			pageToken,
			DEFAULT_PAGE_SIZE
		);
		return PageInfo.of(data, DEFAULT_PAGE_SIZE, MedicalHistoryResponse::operatedDate);
	}

	public void deleteMedicalHistory(Long id) {
		medicalHistoryJpaRepository.deleteById(id);
	}

	public DogCenterInfo getDogCenterInfo(Long dogId) {
		return dogJpaRepositoryCustomImpl.getDogCenterInfo(dogId);
	}

	public int getDogCount(Long centerId) {
		return dogJpaRepository.countByCenterId(centerId);
	}

	public List<DogSummaryInfo> getDogSummaries(Long centerId) {
		return dogJpaRepository.getDogSummaries(centerId);
	}
}
