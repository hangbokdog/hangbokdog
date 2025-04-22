package com.ssafy.hangbokdog.dog.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;

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

		Long dogId = dogRepository.createDog(dog).getId();

		return dogId;
	}
}
