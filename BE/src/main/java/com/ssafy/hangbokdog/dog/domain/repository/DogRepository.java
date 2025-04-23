package com.ssafy.hangbokdog.dog.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogRepository {

	private final DogJpaRepository dogJpaRepository;
	private final DogJpaRepositoryCustomImpl dogJpaRepositoryCustomImpl;

	public Dog createDog(Dog dog) {
		return dogJpaRepository.save(dog);
	}

	public DogDetailResponse getDogDetail(Long id) {
		return dogJpaRepositoryCustomImpl.getDogDetail(id);
	}

	public Optional<Dog> getDog(Long id) {
		return dogJpaRepository.findById(id);
	}

	public boolean checkDogExistence(Long id) {
		return dogJpaRepository.existsById(id);
	}
}
