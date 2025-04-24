package com.ssafy.hangbokdog.foster.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FosterService {

	private final FosterRepository fosterRepository;

	public Long applyFoster(
		Long memberId,
		Long dogId
	) {
		return fosterRepository.createFoster(Foster.createFoster(
			memberId,
			dogId,
			FosterStatus.APPLYING
			)
		).getId();
	}

	@Transactional
	public void acceptFoster(Long fosterId) {
		Foster foster = getFosterById(fosterId);

		foster.checkApplying();

		foster.acceptFoster();
	}

	@Transactional
	public void rejectFoster(Long fosterId) {
		Foster foster = getFosterById(fosterId);

		foster.checkApplying();

		foster.rejectFoster();
	}

	@Transactional
	public void cancelFoster(Long fosterId) {
		Foster foster = getFosterById(fosterId);

		foster.checkApplying();

		foster.cancelFoster();
	}

	private Foster getFosterById(Long fosterId) {
		return fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));
	}
}
