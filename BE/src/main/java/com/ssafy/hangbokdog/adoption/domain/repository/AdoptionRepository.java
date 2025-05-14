package com.ssafy.hangbokdog.adoption.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.adoption.domain.Adoption;
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
	
	public PageInfo<AdoptionApplicationResponse> getAdoptionApplicationsByCenterId(Long centerId, String pageToken) {
		var data = adoptionJpaRepository.getAdoptionApplicationsByCenterId(centerId, pageToken, ADOPTION_PAGE_SIZE);
		return PageInfo.of(data, ADOPTION_PAGE_SIZE, AdoptionApplicationResponse::adoptionId);
	}
}
