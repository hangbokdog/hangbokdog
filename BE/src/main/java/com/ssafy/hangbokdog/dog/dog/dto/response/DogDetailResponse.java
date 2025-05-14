package com.ssafy.hangbokdog.dog.dog.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;

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
	int age,
	String location,
	Long locationId,
	boolean isLiked,
	int favoriteCount,
	int currentSponsorCount,
	int dogCommentCount,
	Boolean isFosterApply
) {
	public static DogDetailResponse from(
		DogDetailInfo info,
		boolean isLiked,
		int favoriteCount,
		int currentSponsorCount,
		int dogCommentCount,
		Boolean isFosterApply
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
			info.locationId(),
			isLiked,
			favoriteCount,
			currentSponsorCount,
			dogCommentCount,
			isFosterApply
		);
	}
}
