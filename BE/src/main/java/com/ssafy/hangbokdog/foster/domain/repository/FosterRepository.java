package com.ssafy.hangbokdog.foster.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.foster.domain.Foster;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FosterRepository {

	private final FosterJpaRepository fosterJpaRepository;

	public Foster createFoster(Foster foster) {
		return fosterJpaRepository.save(foster);
	}
}
