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

		if (dogRepository.checkDogExistence(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		FavoriteDog favoriteDog = FavoriteDog.createFavoriteDog(
			member.getId(),
			dogId
		);

		return favoriteDogRepository.createFavoriteDog(favoriteDog).getId();
	}
}
