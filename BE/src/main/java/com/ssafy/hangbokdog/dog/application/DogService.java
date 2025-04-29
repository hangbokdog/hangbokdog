package com.ssafy.hangbokdog.dog.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dto.request.MedicalHistoryRequest;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dto.response.MedicalHistoryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DogService {

	private final DogRepository dogRepository;

	public Long createDog(
		DogCreateRequest request,
		String imageUrl
	) {

		Dog dog = Dog.createDog(
			request.status(),
			request.centerId(),
			request.name(),
			request.breed(),
			imageUrl,
			request.color(),
			request.rescuedDate(),
			request.weight(),
			request.description(),
			request.isStar(),
			request.gender(),
			request.isNeutered()
		);

		return dogRepository.createDog(dog).getId();
	}

	public DogDetailResponse getDogDetail(Long dogId, Long centerId) {

		checkDogExistence(dogId);

		return dogRepository.getDogDetail(dogId, centerId);
	}

	@Transactional
	public void dogToStar(Long dogId) {

		Dog dog = checkDogExistence(dogId);

		dog.dogToStar();
	}

	@Transactional
	public void updateDog(
		DogUpdateRequest request,
		String imageUrl,
		Long dogId
	) {

		Dog dog = checkDogExistence(dogId);

		if (imageUrl == null) {
			imageUrl = dog.getProfileImage();
		}

		dog.updateDog(
			request.dogName(),
			imageUrl,
			request.weight(),
			request.description(),
			request.isNeutered()
		);
	}

	public Long addMedicalHistory(
		MedicalHistoryRequest request,
		Long dogId
	) {
		MedicalHistory medicalHistory = MedicalHistory.createMedicalHistory(
			dogId,
			request.content(),
			request.medicalPeriod(),
			request.medicalType(),
			request.operatedDate()
		);

		// TODO:담당자 이름을 넣어야 될수도 있음
		return dogRepository.createMedicalHistory(medicalHistory).getId();
	}

	public PageInfo<MedicalHistoryResponse> getMedicalHistories(
		Long dogId,
		String pageToken
	) {
		return dogRepository.findAllMedicalHistory(pageToken, dogId);
	}

	public void deleteMedicalHistory(Long dogId) {
		dogRepository.deleteMedicalHistory(dogId);
	}

	public DogCenterInfo getDogCenterInfo(Long dogId) {
		return dogRepository.getDogCenterInfo(dogId);
	}

	private Dog checkDogExistence(Long dogId) {
		return dogRepository.getDog(dogId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));
	}
}
