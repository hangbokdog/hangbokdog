package com.ssafy.hangbokdog.foster.dto;

public record FosterDiaryCheckQuery(
	Long memberId,
	Long dogId,
	Integer postCount
) {
}
