package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.dog.domain.FavoriteDog;
import com.ssafy.hangbokdog.dog.dog.dto.FavoriteDogCount;

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

	public List<Long> getFavoriteDogIds(Long memberId) {
		return favoriteDogJpaRepository.getFavoriteDogIdsByMemberId(memberId);
	}

	public boolean existsByDogIdAndMemberId(Long dogId, Long memberId) {
		return favoriteDogJpaRepository.existsFavoriteDogByDogId(dogId, memberId);
	}

	public Long getFavoriteCountByDogId(Long dogId) {
		return favoriteDogJpaRepository.getFavoriteDogCountByDogId(dogId);
	}

	public List<FavoriteDogCount> getFavoriteCountByDogIds(List<Long> dogIds) {
		return favoriteDogJpaRepository.getFavoriteCountByDogIds(dogIds);
	}
}
