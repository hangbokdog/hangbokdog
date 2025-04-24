package com.ssafy.hangbokdog.foster.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.Dog;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FosterService {

	private final FosterRepository fosterRepository;
	private final DogRepository dogRepository;

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

			case COMPLETED:
				if (!foster.checkFostering()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.completeFoster();
				dog.goProtected();
				break;

			case STOPPED:
				if (!foster.checkFostering()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.completeFoster();
				dog.goProtected();
				//TODO: 기록은 STOPPED으로 기록하기
				break;
		}
	}

	public List<MyFosterResponse> getMyFosters(Long memberId) {
		return fosterRepository.findMyFosters(memberId);
	}

	private Foster getFosterById(Long fosterId) {
		return fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));
	}
}
