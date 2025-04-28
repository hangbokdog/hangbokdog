package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.dog.domain.Dog;

public interface DogJpaRepository extends JpaRepository<Dog, Long>, DogJpaRepositoryCustom {
}
