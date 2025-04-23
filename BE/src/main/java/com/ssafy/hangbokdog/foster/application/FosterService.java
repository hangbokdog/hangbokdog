package com.ssafy.hangbokdog.foster.application;

import org.springframework.stereotype.Service;

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
}
