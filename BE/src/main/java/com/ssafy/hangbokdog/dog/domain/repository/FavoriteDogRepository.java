package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.domain.FavoriteDog;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FavoriteDogRepository {

	private final FavoriteDogJpaRepository favoriteDogJpaRepository;

	public FavoriteDog createFavoriteDog(FavoriteDog favoriteDog) {
		return favoriteDogJpaRepository.save(favoriteDog);
	}

	public void deleteFavoriteDog(
		Long dogId,
		Long memberId
	) {
		favoriteDogJpaRepository.deleteFavoriteDogByDogIdAndMemberId(
			dogId,
			memberId
		);
	}
}
