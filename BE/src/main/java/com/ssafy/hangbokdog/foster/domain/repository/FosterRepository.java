package com.ssafy.hangbokdog.foster.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.FosterHistory;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FosterRepository {

	private final FosterJpaRepository fosterJpaRepository;
	private final FosterJpaRepositoryCustomImpl fosterJpaRepositoryCustomImpl;
	private final FosterHistoryJpaRepository fosterHistoryJpaRepository;

	public Foster createFoster(Foster foster) {
		return fosterJpaRepository.save(foster);
	}

	public Optional<Foster> findFosterById(Long fosterId) {
		return fosterJpaRepository.findById(fosterId);
	}

	public boolean checkFosterExistByMemberIdAndDogId(Long memberId, Long dogId) {
		return fosterJpaRepository.existsByMemberIdAndDogId(memberId, dogId);
	}

	public List<MyFosterResponse> findMyFosters(Long memberId) {
		return fosterJpaRepositoryCustomImpl.findMyFosters(memberId);
	}

	public int checkDogFosterCount(Long dogId) {
		return fosterJpaRepositoryCustomImpl.countDogFosters(dogId);
	}

	public FosterHistory createFosterHistory(FosterHistory fosterHistory) {
		return fosterHistoryJpaRepository.save(fosterHistory);
	}
}
