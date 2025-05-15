package com.ssafy.hangbokdog.adoption.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.adoption.domain.Adoption;
import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.adoption.domain.repository.AdoptionRepository;
import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptedDogDetailResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplyDogCountResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionCreateResponse;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.comment.domain.repository.DogCommentRepository;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.dog.dog.domain.repository.FavoriteDogRepository;
import com.ssafy.hangbokdog.dog.dog.dto.DogSummaryInfo;
import com.ssafy.hangbokdog.dog.dog.dto.FavoriteDogCount;
import com.ssafy.hangbokdog.dog.dog.dto.response.DogSearchResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdoptionService {

	private final AdoptionRepository adoptionRepository;
	private final DogRepository dogRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final FavoriteDogRepository favoriteDogRepository;
	private final DogCommentRepository dogCommentRepository;

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

		Dog dog = dogRepository.getDog(adoption.getDogId())
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));

		if (request == AdoptionStatus.REJECTED) {
			adoption.reject();
		} else if (request == AdoptionStatus.ACCEPTED) {
			adoption.accept();
			dog.goAdopted();
		} else {
			throw new BadRequestException(ErrorCode.INVALID_REQUEST);
		}
	}

	public List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long memberId, Long centerId) {

		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return adoptionRepository.getAdoptionApplicationsByCenterId(centerId);
	}

	public List<AdoptionApplicationByDogResponse> getAdoptionApplicationsByDogId(Long memberId, Long centerId, Long dogId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return adoptionRepository.getAdoptionApplicationsByDogId(dogId);
	}

	public AdoptedDogDetailResponse getAdoptedDogDetail(Member member, Long dogId) {
		AdoptedDogDetailInfo info = adoptionRepository.getAdoptedDogDetail(dogId);
		boolean isFavorite = favoriteDogRepository.existsByDogIdAndMemberId(dogId, member.getId());
		int favoriteCount = favoriteDogRepository.getFavoriteCountByDogId(dogId).intValue();
		int dogCommentCount = dogCommentRepository.countByDogId(dogId);

		return AdoptedDogDetailResponse.from(
			info,
			isFavorite,
			favoriteCount,
			dogCommentCount
		);
	}

	public PageInfo<DogSearchResponse> searchAdoptedDogs(
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
		DogStatus status,
		String pageToken
	) {
		PageInfo<DogSummaryInfo> dogSummaryInfos = dogRepository.searchAdoptedDogs(
			name,
			breeds,
			gender,
			start,
			end,
			isNeutered,
			locationIds,
			isStar,
			centerId,
			status,
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

	public AdoptionApplyDogCountResponse getAdoptionApplyDogCount(Long memberId, Long centerId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return new AdoptionApplyDogCountResponse(adoptionRepository.countAdoptionWaitingDogs(centerId));
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
