package com.ssafy.hangbokdog.foster.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.FosterHistory;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;
import com.ssafy.hangbokdog.foster.dto.FosterDiaryCheckQuery;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationByDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterDiaryCheckResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosteredDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FosterService {

	private final FosterRepository fosterRepository;
	private final DogRepository dogRepository;
	private final PostRepository postRepository;
	private final CenterMemberRepository centerMemberRepository;

	public Long applyFoster(
			Long centerId,
		Long memberId,
		Long dogId
	) {
		CenterMember centerMember = checkCenterMember(memberId, centerId);

		if (fosterRepository.checkFosterExistByMemberIdAndDogId(memberId, dogId)) {
			throw new BadRequestException(ErrorCode.FOSTER_ALREADY_EXISTS);
		}

		if (fosterRepository.checkDogFosterCount(dogId) >= 2) {
			throw new BadRequestException(ErrorCode.FOSTER_ALREADY_FULL);
		}

		if (!dogRepository.existsById(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		fosterRepository.createFosterHistory(
			FosterHistory.createFosterHistory(
				memberId,
				dogId,
				FosterStatus.APPLYING
			)
		);

		return fosterRepository.createFoster(Foster.createFoster(
			memberId,
			dogId,
			FosterStatus.APPLYING
			)
		).getId();
	}

	@Transactional
	public void cancelFosterApplication(
		Long memberId,
		Long fosterId
	) {
		Foster foster = getFosterById(fosterId);

		if (!foster.checkApplying() && !foster.checkOwner(memberId)) {
			throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
		}

		foster.cancelFosterApplication();

		fosterRepository.createFosterHistory(FosterHistory.createFosterHistory(
			foster.getMemberId(),
			foster.getDogId(),
			FosterStatus.CANCELLED
		));
	}

	@Transactional
	public void decideFosterApplication(
		Long memberId,
		Long centerId,
		Long fosterId,
		FosterStatus request
	) {
		CenterMember centerMember = checkCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Foster foster = getFosterById(fosterId);

		Dog dog = dogRepository.getDog(foster.getDogId())
			.orElseThrow(() -> new BadRequestException(ErrorCode.DOG_NOT_FOUND));

		switch (request) {
			case ACCEPTED:
				if (!foster.checkApplying()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.acceptFosterApplication();
				break;

			case REJECTED:
				if (!foster.checkApplying()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.rejectFosterApplication();
				break;

			case FOSTERING:
				foster.startFoster();
				dog.goFoster();
				break;

			case COMPLETED, STOPPED:
				foster.completeFoster();
				dog.goProtected();
				break;
		}

		fosterRepository.createFosterHistory(FosterHistory.createFosterHistory(
			foster.getMemberId(),
			foster.getDogId(),
			request
		));
	}

	public List<MyFosterResponse> getMyFosters(Long memberId) {
		return fosterRepository.findMyFosters(memberId);
	}

	public List<MyFosterResponse> getMyFosterApplications(Long memberId) {
		return fosterRepository.findMyFosterApplications(memberId);
	}

	public List<FosterDiaryCheckResponse> checkFosterDiaries(
			Long memberId,
			Long centerId
	) {

		CenterMember centerMember = checkCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}


		LocalDateTime endDate = LocalDateTime.now();
		LocalDateTime startDate = endDate.minusDays(7);

		Map<String, StartedFosterInfo> fosterInfoMap = fosterRepository.findAcceptedFosters()
			.stream()
			.collect(Collectors.toMap(
				info -> info.memberId() + "-" + info.dogId(),
				Function.identity()
			));

		if (fosterInfoMap.isEmpty()) {
			return Collections.emptyList();
		}

		List<FosterDiaryCheckQuery> diaryCounts = postRepository.findFostersWithInsufficientDiaries(
			new ArrayList<>(fosterInfoMap.values()),
			startDate,
			endDate
		);

		Map<String, Integer> countMap = diaryCounts.stream()
			.collect(Collectors.toMap(
				query -> query.memberId() + "-" + query.dogId(),
				FosterDiaryCheckQuery::postCount
			));

		return fosterInfoMap.values().stream()
			.map(info -> {
				String key = info.memberId() + "-" + info.dogId();
				int count = countMap.getOrDefault(key, 0);

				if (count >= 3) {
					return null;
				}

				return new FosterDiaryCheckResponse(
					info.memberId(),
					info.name(),
					info.profileImage(),
					info.dogId(),
					info.dogName(),
					info.fosterId(),
					count
				);
			})
			.filter(Objects::nonNull)
			.collect(Collectors.toList());
	}

	public List<DogFosterResponse> getFostersByDogId(Long dogId) {
		if (!dogRepository.existsById(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		return fosterRepository.getFostersByDogId(dogId);
	}

	public List<FosterApplicationResponse> getFosterApplicationsByCenterId(Long memberId, Long centerId) {

		CenterMember centerMember = checkCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return fosterRepository.getFosterApplicationsByCenterId(centerId);
	}

	public List<FosterApplicationByDogResponse> getFosterApplicationsByDogId(
		Long memberId,
		Long centerId,
		Long dogId,
		String name
	) {
		CenterMember centerMember = checkCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return fosterRepository.getFosterApplicationsByDogId(dogId, name);
	}

	public List<FosteredDogResponse> getFosteredDogs(Long memberId, Long centerId) {
		CenterMember centerMember = checkCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return fosterRepository.getFosteredDogsByCenterId(centerId);
	}

	private CenterMember checkCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}

	private Foster getFosterById(Long fosterId) {
		return fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));
	}
}
