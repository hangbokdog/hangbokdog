package com.ssafy.hangbokdog.dog.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dto.DogDetailInfo;

public record DogDetailResponse(
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
	Integer age,
	String location,
	boolean isLiked,
	int favoriteCount,
	Integer currentSponsorCount
) {
	public static DogDetailResponse from(
		DogDetailInfo info,
		boolean isLiked,
		int favoriteCount,
		int currentSponsorCount
	) {
		return new DogDetailResponse(
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
			info.location(),
			isLiked,
			favoriteCount,
			currentSponsorCount
		);
	}
}
