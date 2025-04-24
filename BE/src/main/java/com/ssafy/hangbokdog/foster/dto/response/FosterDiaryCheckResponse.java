package com.ssafy.hangbokdog.foster.dto.response;

public record FosterDiaryCheckResponse(
	Long memberId,
	String name,
	String profileImage,
	Long dogId,
	String dogName,
	Long fosterId,
	Integer postCount
){
}
