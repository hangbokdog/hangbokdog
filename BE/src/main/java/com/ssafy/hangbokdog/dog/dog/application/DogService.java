package com.ssafy.hangbokdog.dog.dog.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.comment.domain.repository.DogCommentRepository;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.MedicalHistory;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dog.domain.repository.FavoriteDogRepository;
import com.ssafy.hangbokdog.dog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogDetailInfo;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummary;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dog.dto.FavoriteDogCount;
import com.ssafy.hangbokdog.dog.dog.dto.request.DogCreateRequest;
import com.ssafy.hangbokdog.dog.dog.dto.request.DogUpdateRequest;
import com.ssafy.hangbokdog.dog.dog.dto.request.MedicalHistoryRequest;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogCreateResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogDetailResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogSearchResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.HospitalDogResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.LocationDogCountResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.MedicalHistoryResponse;
import com.ssafy.hangbokdog.dog.dog.dto.response.ProtectedDogCountResponse;
import com.ssafy.hangbokdog.sponsorship.domain.repository.SponsorshipRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DogService {

	private final DogRepository dogRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final FavoriteDogRepository favoriteDogRepository;
	private final SponsorshipRepository sponsorshipRepository;
	private final DogCommentRepository dogCommentRepository;

	public DogCreateResponse createDog(
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


		return new DogCreateResponse(dogRepository.createDog(dog).getId());
	}

	public DogDetailResponse getDogDetail(Long dogId, Long centerId, Long memberId) {

		if (!dogRepository.existsById(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		DogDetailInfo dogDetailInfo = dogRepository.getDogDetail(dogId, centerId);
		boolean isFavorite = favoriteDogRepository.existsByDogIdAndMemberId(dogId, memberId);
		int favoriteCount = favoriteDogRepository.getFavoriteCountByDogId(dogId).intValue();
		int sponsorCount = sponsorshipRepository.countActiveSponsorshipByDogId(dogId);
		int dogCommentCount = dogCommentRepository.countByDogId(dogId);

		return DogDetailResponse.from(dogDetailInfo, isFavorite, favoriteCount, sponsorCount, dogCommentCount);
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
			request.locationId(),
			request.dogBreed(),
			request.isStar()
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

	public ProtectedDogCountResponse getDogCount(Long centerId, Long memberId) {
		int count = dogRepository.getDogCount(centerId);
		List<DogSummaryInfo> dogSummaryInfos = dogRepository.getDogSummaries(centerId);
		List<DogSummary> dogSummaries = new ArrayList<>();

		if (memberId == null) {
			for (DogSummaryInfo info : dogSummaryInfos) {
				dogSummaries.add(new DogSummary(
					info.dogId(),
					info.name(),
					info.imageUrl(),
					info.ageMonth(),
					info.gender(),
					false
				));
			}
		} else {
			List<Long> favoriteDogIds = favoriteDogRepository.getFavoriteDogIds(memberId);
			for (DogSummaryInfo info : dogSummaryInfos) {
				boolean isFavorite = favoriteDogIds.contains(info.dogId());
				dogSummaries.add(new DogSummary(
					info.dogId(),
					info.name(),
					info.imageUrl(),
					info.ageMonth(),
					info.gender(),
					isFavorite
				));
			}
		}

		return new ProtectedDogCountResponse(count, dogSummaries);
	}

	public PageInfo<DogSearchResponse> searchDogs(
		Long memberId,
		String name,
		List<DogBreed> breeds,
		Gender gender,
		LocalDateTime start,
		LocalDateTime end,
		Boolean isNeutered,
		List<Long> locationIds,
		Boolean isStar,
		Long centerId,
		String pageToken
	) {
		PageInfo<DogSummaryInfo> dogSummaryInfos = dogRepository.searchDogs(
			name,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			locationIds,
			isStar,
			centerId,
			pageToken
		);

		List<Long> dogIds = dogSummaryInfos.data().stream()
			.map(DogSummaryInfo::dogId)
			.toList();

		List<Long> favoriteDogIds = favoriteDogRepository.getFavoriteDogIds(memberId);

		List<FavoriteDogCount> favoriteDogCounts = favoriteDogRepository.getFavoriteCountByDogIds(dogIds);

		Map<Long, Integer> favoriteCountMap = favoriteDogCounts.stream()
			.collect(Collectors.toMap(
				FavoriteDogCount::dogId,
				FavoriteDogCount::count
			));

		List<DogSearchResponse> responses = dogSummaryInfos.data().stream()
			.map(dog -> new DogSearchResponse(
				dog.dogId(),
				dog.name(),
				dog.imageUrl(),
				dog.ageMonth(),
				dog.gender(),
				favoriteDogIds.contains(dog.dogId()),
				favoriteCountMap.getOrDefault(dog.dogId(), 0),
				dog.isStar()
			))
			.toList();

		return new PageInfo<>(dogSummaryInfos.pageToken(), responses, dogSummaryInfos.hasNext());
	}

	public LocationDogCountResponse getLocationDogCount(Long locationId) {
		return new LocationDogCountResponse(dogRepository.getLocationDogCount(locationId));
	}

	public PageInfo<HospitalDogResponse> getHospitalDogs(Long centerId, String pageToken) {
		return dogRepository.getHospitalDogs(centerId, pageToken);
	}

	private Dog findDog(Long dogId) {
		return dogRepository.getDog(dogId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));
	}
}
