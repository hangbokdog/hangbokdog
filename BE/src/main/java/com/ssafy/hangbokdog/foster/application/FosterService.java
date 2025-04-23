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
		Foster foster = fosterRepository.findFosterById(fosterId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND));

		if (foster.getStatus().equals(FosterStatus.COMPLETED)) {
			throw new BadRequestException(ErrorCode.FOSTER_APPLICATION_NOT_FOUND);
		}

		foster.acceptFoster();
	}
}
