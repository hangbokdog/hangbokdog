package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dog.dto.response.HospitalDogResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.MedicalHistoryResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogRepository {

	private static final int MEDICAL_PAGE_SIZE = 10;
	private static final int DOG_PAGE_SIZE = 30;

	private final DogJpaRepository dogJpaRepository;
	private final MedicalHistoryJdbcRepository medicalHistoryJdbcRepository;
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
		List<DogBreed> breeds,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		List<Long> locationIds,
		Boolean isStar,
		Long centerId,
		String pageToken
	) {
		var data = dogJpaRepository.searchDogs(
			name,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			locationIds,
			isStar,
			centerId,
			pageToken,
			DOG_PAGE_SIZE
		);
		return PageInfo.of(data, DOG_PAGE_SIZE, DogSummaryInfo::dogId);
	}

	public PageInfo<DogSummaryInfo> searchAdoptedDogs(
		String name,
		List<DogBreed> breeds,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		List<Long> locationIds,
		Boolean isStar,
		Long centerId,
		String pageToken
	) {
		var data = dogJpaRepository.searchAdoptedDogs(
			name,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			locationIds,
			isStar,
			centerId,
			pageToken,
			DOG_PAGE_SIZE
		);
		return PageInfo.of(data, DOG_PAGE_SIZE, DogSummaryInfo::dogId);
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

	public int getLocationDogCountIn(List<Long> locationIds) {
		return dogJpaRepository.countByLocationIdsIn(locationIds);
	}

	public PageInfo<VaccinationDoneResponse> getNotVaccinatedDogs(
		List<Long> dogIds,
		String keyword,
		List<Long> locationIds,
		String pageToken
	) {
		var data = dogJpaRepository.getNotVaccinatedDogs(
			dogIds,
			keyword,
			locationIds,
			pageToken,
			DOG_PAGE_SIZE
		);
		return PageInfo.of(data, DOG_PAGE_SIZE, VaccinationDoneResponse::dogId);
	}

	public void bulkInsertMedicalHistories(
		List<Long> dogIds,
		String content,
		LocalDateTime operatedTime
	) {
		medicalHistoryJdbcRepository.bulkInsertMedicalHistory(dogIds, content, operatedTime);
	}

	public PageInfo<HospitalDogResponse> getHospitalDogs(Long centerId, String pageToken) {
		var data = dogJpaRepository.getHospitalDogs(centerId, pageToken, DOG_PAGE_SIZE);
		return PageInfo.of(data, DOG_PAGE_SIZE, HospitalDogResponse::dogId);
	}
}
