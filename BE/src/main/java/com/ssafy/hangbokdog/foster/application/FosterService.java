package com.ssafy.hangbokdog.foster.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;

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
				break;

			case COMPLETED:
				if (!foster.checkFostering()) {
					throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
				}
				foster.completeFoster();
				break;
		}
	}

	private Foster getFosterById(Long fosterId) {
		return fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));
	}
}
