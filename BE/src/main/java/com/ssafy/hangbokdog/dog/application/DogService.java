package com.ssafy.hangbokdog.dog.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;

import com.ssafy.hangbokdog.member.domain.Grade;
import com.ssafy.hangbokdog.member.domain.Member;
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

	public DogDetailResponse getDogDetail(Long dogId) {

		checkDogExistence(dogId);

		return dogRepository.getDogDetail(dogId);
	}

	@Transactional
	public void dogToStar(Long dogId) {

		Dog dog = checkDogExistence(dogId);

		dog.dogToStar();
	}

	@Transactional
	public void updateDog(
		Member member,
		DogUpdateRequest request,
		String imageUrl,
		Long dogId
	) {
		if (!member.getGrade().equals(Grade.ADMIN)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHORIZED_MEMBER);
		}

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

	private Dog checkDogExistence(Long dogId) {
		return dogRepository.getDog(dogId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));
	}
}
