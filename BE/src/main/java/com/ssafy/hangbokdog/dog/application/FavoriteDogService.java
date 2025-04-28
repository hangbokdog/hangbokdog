package com.ssafy.hangbokdog.dog.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.FavoriteDog;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.domain.repository.FavoriteDogRepository;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteDogService {

	private final FavoriteDogRepository favoriteDogRepository;
	private final DogRepository dogRepository;

	public Long addFavoriteDog(
		Member member,
		Long dogId
	) {

		checkDogExistence(dogId);

		FavoriteDog favoriteDog = FavoriteDog.createFavoriteDog(
			member.getId(),
			dogId
		);

		return favoriteDogRepository.createFavoriteDog(favoriteDog).getId();
	}

	public void deleteFavoriteDog(
		Member member,
		Long dogId
	) {

		checkDogExistence(dogId);

		favoriteDogRepository.deleteFavoriteDog(
			dogId,
			member.getId()
		);
	}

	private void checkDogExistence(Long dogId) {
		if (!dogRepository.checkDogExistence(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}
	}

}
