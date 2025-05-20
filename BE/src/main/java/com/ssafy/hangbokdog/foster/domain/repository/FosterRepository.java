package com.ssafy.hangbokdog.foster.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.foster.domain.Foster;
import com.ssafy.hangbokdog.foster.domain.FosterHistory;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.foster.dto.response.DogFosterResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationByDogResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosterApplicationResponse;
import com.ssafy.hangbokdog.foster.dto.response.FosteredDogResponse;
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

	public Boolean isFosterApplying(Long memberId, Long dogId) {
		return fosterJpaRepository.isFosterApply(memberId, dogId);
	}

	public int getFosterCount(Long centerId) {
		return fosterJpaRepository.getFosterCount(centerId);
	}

	public int getLastMonthFosterCount(Long centerId, LocalDateTime lastMonthEnd) {
		return fosterJpaRepository.getLastMonthFosterCount(centerId, lastMonthEnd);
	}

	public List<FosterApplicationResponse> getFosterApplicationsByCenterId(Long centerId) {
		return fosterJpaRepository.getFosterApplicationsByCenterId(centerId);
	}

	public List<FosterApplicationByDogResponse> getFosterApplicationsByDogId(Long dogId, String name) {
		return fosterJpaRepository.getFosterApplicationsByDogId(dogId, name);
	}

	public List<FosteredDogResponse> getFosteredDogsByCenterId(Long centerId) {
		return fosterJpaRepository.getFosteredDogsByCenterId(centerId);
	}
}
