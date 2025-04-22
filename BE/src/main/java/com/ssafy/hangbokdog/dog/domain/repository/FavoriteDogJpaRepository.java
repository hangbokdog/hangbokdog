package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.dog.domain.FavoriteDog;

public interface FavoriteDogJpaRepository extends JpaRepository<FavoriteDog, Long> {
}
