package com.ssafy.hangbokdog.dog.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.CenterGrade;
import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dto.DogSummary;
import com.ssafy.hangbokdog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dto.request.MedicalHistoryRequest;
import com.ssafy.hangbokdog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dto.response.MedicalHistoryResponse;
import com.ssafy.hangbokdog.dog.dto.response.ProtectedDogCountResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DogService {

	private final DogRepository dogRepository;
	private final CenterMemberRepository centerMemberRepository;

	public Long createDog(
		Long memberId,
		DogCreateRequest request,
		String imageUrl
	) {

		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, request.centerId())
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.getGrade().equals(CenterGrade.MANAGER)) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Dog dog = Dog.builder()
			.status(request.status())
			.centerId(request.centerId())
			.name(request.name())
			.dogBreed(request.breed())
			.profileImage(imageUrl)
			.color(request.color())
			.rescuedDate(request.rescuedDate())
			.weight(request.weight())
			.description(request.description())
			.isStar(request.isStar())
			.birth(request.birth())
			.locationId(request.locationId())
			.gender(request.gender())
			.isNeutered(request.isNeutered())
			.build();


		return dogRepository.createDog(dog).getId();
	}

	public DogDetailResponse getDogDetail(Long dogId, Long centerId) {

		if (!dogRepository.existsById(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		return dogRepository.getDogDetail(dogId, centerId);
	}

	@Transactional
	public void dogToStar(Long dogId, Long memberId, Long centerId) {

		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.getGrade().equals(CenterGrade.MANAGER)) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Dog dog = findDog(dogId);

		dog.dogToStar();
	}

	@Transactional
	public void updateDog(
		Long memberId,
		Long centerId,
		DogUpdateRequest request,
		String imageUrl,
		Long dogId
	) {

		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.getGrade().equals(CenterGrade.MANAGER)) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Dog dog = findDog(dogId);

		if (imageUrl == null) {
			imageUrl = dog.getProfileImage();
		}

		dog.updateDog(
			request.dogName(),
			imageUrl,
			request.weight(),
			request.description(),
			request.isNeutered(),
			request.locationId()
		);
	}

	public Long addMedicalHistory(
		Long memberId,
		Long centerId,
		MedicalHistoryRequest request,
		String imageUrl,
		Long dogId
	) {

		MedicalHistory medicalHistory = MedicalHistory.builder()
			.dogId(dogId)
			.content(request.content())
			.medicalPeriod(request.medicalPeriod())
			.medicalType(request.medicalType())
			.operatedDate(request.operatedDate())
			.medicalHistoryImage(imageUrl)
			.build();

		return dogRepository.createMedicalHistory(medicalHistory).getId();
	}

	public PageInfo<MedicalHistoryResponse> getMedicalHistories(
		Long dogId,
		String pageToken
	) {
		return dogRepository.findAllMedicalHistory(pageToken, dogId);
	}

	public void deleteMedicalHistory(
		Long memberId,
		Long centerId,
		Long medicalHistoryId
	) {

		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.getGrade().equals(CenterGrade.MANAGER)) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		dogRepository.deleteMedicalHistory(medicalHistoryId);
	}

	public DogCenterInfo getDogCenterInfo(Long dogId) {
		return dogRepository.getDogCenterInfo(dogId);
	}

	public ProtectedDogCountResponse getDogCount(Long centerId) {
		int count = dogRepository.getDogCount(centerId);
		List<DogSummary> dogSummaries = dogRepository.getDogSummaries(centerId);

		return new ProtectedDogCountResponse(count, dogSummaries);
	}

	private Dog findDog(Long dogId) {
		return dogRepository.getDog(dogId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));
	}
}
