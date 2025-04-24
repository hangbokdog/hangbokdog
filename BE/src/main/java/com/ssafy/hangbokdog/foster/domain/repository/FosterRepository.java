package com.ssafy.hangbokdog.foster.domain.repository;

import java.util.Optional;

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

	public Optional<Foster> findFosterById(Long fosterId) {
		return fosterJpaRepository.findById(fosterId);
	}

	public boolean checkFosterExistByMemberIdAndDogId(Long memberId, Long dogId) {
		return fosterJpaRepository.existsByMemberIdAndDogId(memberId, dogId);
	}
}
