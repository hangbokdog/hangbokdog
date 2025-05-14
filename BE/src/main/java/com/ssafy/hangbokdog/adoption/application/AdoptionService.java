package com.ssafy.hangbokdog.adoption.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.adoption.domain.Adoption;
import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.adoption.domain.repository.AdoptionRepository;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionCreateResponse;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdoptionService {

	private final AdoptionRepository adoptionRepository;
	private final DogRepository dogRepository;
	private final CenterMemberRepository centerMemberRepository;

	public AdoptionCreateResponse applyAdoption(Long memberId, Long dogId) {
		Dog dog = dogRepository.getDog(dogId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));

		CenterMember centerMember = getCenterMember(memberId, dog.getCenterId());

		if (!adoptionRepository.checkExist(memberId, dogId)) {
			throw new BadRequestException(ErrorCode.ADOPTION_ALREADY_EXISTS);
		}

		Adoption adoption = Adoption.builder()
			.memberId(memberId)
			.dogId(dogId)
			.status(AdoptionStatus.APPLIED)
			.build();

		return new AdoptionCreateResponse(adoptionRepository.save(adoption).getId());
	}

	@Transactional
	public void manageAdoption(Long memberId, Long adoptionId, Long centerId, AdoptionStatus request) {

		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Adoption adoption = adoptionRepository.findById(adoptionId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.ADOPTION_NOT_FOUND));

		if (request == AdoptionStatus.REJECTED) {
			adoption.reject();
		} else if (request == AdoptionStatus.ACCEPTED) {
			adoption.accept();
		} else {
			throw new BadRequestException(ErrorCode.INVALID_REQUEST);
		}
	}

	public PageInfo<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(
		Long memberId,
		Long centerId,
		String pageToken
	) {

		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return adoptionRepository.getAdoptionApplicationsByCenterId(centerId, pageToken);
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
