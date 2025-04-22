package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.domain.Dog;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DogRepository {

	private final DogJpaRepository dogJpaRepository;

	public Dog createDog(Dog dog) {
		return dogJpaRepository.save(dog);
	}
}
