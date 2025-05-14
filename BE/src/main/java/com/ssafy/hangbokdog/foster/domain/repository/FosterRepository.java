package com.ssafy.hangbokdog.foster.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.FosterHistory;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.MyFosterResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FosterRepository {

	private final FosterJpaRepository fosterJpaRepository;
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

	public List<StartedFosterInfo> findAcceptedFosters() {
		return fosterJpaRepository.findAcceptedFosters();
	}

	public List<MyFosterResponse> findMyFosters(Long memberId) {
		return fosterJpaRepository.findMyFosters(memberId);
	}

	public List<MyFosterResponse> findMyFosterApplications(Long memberId) {
		return fosterJpaRepository.findMyFosterApplications(memberId);
	}

	public int checkDogFosterCount(Long dogId) {
		return fosterJpaRepository.countDogFosters(dogId);
	}

	public FosterHistory createFosterHistory(FosterHistory fosterHistory) {
		return fosterHistoryJpaRepository.save(fosterHistory);
	}

	public List<DogFosterResponse> getFostersByDogId(Long dogId) {
		return fosterJpaRepository.getFostersByDogId(dogId);
	}

	public boolean isFosterApplying(Long memberId, Long dogId) {
		return fosterJpaRepository.isFosterApply(memberId, dogId);
	}
}
