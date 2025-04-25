package com.ssafy.hangbokdog.foster.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.FosterHistory;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;
import com.ssafy.hangbokdog.foster.dto.FosterDiaryCheckQuery;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.FosterDiaryCheckResponse;
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

	public Long applyFoster(
		Long memberId,
		Long dogId
	) {
		if (fosterRepository.checkFosterExistByMemberIdAndDogId(memberId, dogId)) {
			throw new BadRequestException(ErrorCode.FOSTER_ALREADY_EXISTS);
		}

		if (fosterRepository.checkDogFosterCount(dogId) >= 2) {
			throw new BadRequestException(ErrorCode.FOSTER_ALREADY_FULL);
		}

		if (!dogRepository.checkDogExistence(dogId)) {
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
		Long fosterId,
		FosterStatus request
	) {
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
				if (!foster.checkAccepted()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.startFoster();
				dog.goFoster();
				break;

			case COMPLETED, STOPPED:
				if (!foster.checkFostering()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
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

	public List<FosterDiaryCheckResponse> checkFosterDiaries() {
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


	private Foster getFosterById(Long fosterId) {
		return fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));
	}
}
