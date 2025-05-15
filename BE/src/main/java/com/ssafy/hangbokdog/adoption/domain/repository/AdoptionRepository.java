package com.ssafy.hangbokdog.adoption.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.adoption.domain.Adoption;
import com.ssafy.hangbokdog.adoption.dto.AdoptedDogDetailInfo;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationByDogResponse;
import com.ssafy.hangbokdog.adoption.dto.response.AdoptionApplicationResponse;
import com.ssafy.hangbokdog.common.model.PageInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdoptionRepository {

	private static final int ADOPTION_PAGE_SIZE = 10;

	private final AdoptionJpaRepository adoptionJpaRepository;

	public Adoption save(Adoption adoption) {
		return adoptionJpaRepository.save(adoption);
	}

	public Optional<Adoption> findById(Long id) {
		return adoptionJpaRepository.findById(id);
	}

	public List<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long centerId) {
		return adoptionJpaRepository.getAdoptionApplicationsByCenterId(centerId);
	}

	public boolean checkExist(Long memberId, Long dogId) {
		return adoptionJpaRepository.existsByMemberIdAndDogId(memberId, dogId);
	}

	public AdoptedDogDetailInfo getAdoptedDogDetail(Long dogId) {
		return adoptionJpaRepository.getAdoptedDogDetail(dogId);
	}

	public List<AdoptionApplicationByDogResponse> getAdoptionApplicationsByDogId(Long dogId) {
		return adoptionJpaRepository.getAdoptionApplicationsByDogId(dogId);
	}

	public Integer countAdoptionWaitingDogs(Long centerId) {
		return adoptionJpaRepository.countAdoptionWaitingDogs(centerId);
	}

	public Integer countAdoptedDogs(Long centerId) {
		return adoptionJpaRepository.countAdoptedDogs(centerId);
	}
}
