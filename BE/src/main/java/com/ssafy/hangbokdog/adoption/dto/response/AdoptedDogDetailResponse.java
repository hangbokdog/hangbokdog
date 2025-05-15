package com.ssafy.hangbokdog.adoption.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;

public record AdoptedDogDetailResponse(
	Long dogId,
	DogStatus dogStatus,
	Long centerId,
	String centerName,
	String dogName,
	String profileImageUrl,
	List<String> color,
	LocalDateTime rescuedDate,
	Double weight,
	String description,
	Boolean isStar,
	Gender gender,
	Boolean isNeutered,
	DogBreed breed,
	int age,
	boolean isLiked,
	int favoriteCount,
	int dogCommentCount,
	LocalDateTime adoptedDate,
	Long adopterId,
	String adopterName,
	String adopterImage
) {
	public static AdoptedDogDetailResponse from(
		AdoptedDogDetailInfo info,
		boolean isLiked,
		int favoriteCount,
		int dogCommentCount
	) {
		return new AdoptedDogDetailResponse(
			info.dogId(),
			info.dogStatus(),
			info.centerId(),
			info.centerName(),
			info.dogName(),
			info.profileImageUrl(),
			info.color(),
			info.rescuedDate(),
			info.weight(),
			info.description(),
			info.isStar(),
			info.gender(),
			info.isNeutered(),
			info.breed(),
			info.age(),
			isLiked,
			favoriteCount,
			dogCommentCount,
			info.adoptedDate(),
			info.adopterId(),
			info.adopterName(),
			info.adopterImage()
		);
	}
}
