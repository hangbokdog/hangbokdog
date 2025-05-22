package com.ssafy.hangbokdog.vaccination.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationDetailInfo;

public record VaccinationDetailResponse(
	Long vaccinationId,
	String title,
	String content,
	LocalDateTime operatedDate,
	Long authorId,
	String authorName,
	String authorProfileImage,
	Integer completedDogCount,
	Integer totalCount,
	VaccinationStatus status,
	List<String> locationNames
) {

	public static VaccinationDetailResponse of(
		VaccinationDetailInfo info,
		Integer totalCount,
		Integer completedDogCount,
		List<String> lcoationNames
	) {
		return new VaccinationDetailResponse(
			info.vaccinationId(),
			info.title(),
			info.content(),
			info.operatedDate(),
			info.authorId(),
			info.authorName(),
			info.authorProfileImage(),
			completedDogCount,
			totalCount,
			info.status(),
			lcoationNames
		);
	}
}
