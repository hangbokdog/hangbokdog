package com.ssafy.hangbokdog.adoption.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.adoption.domain.Adoption;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdoptionRepository {

	private final AdoptionRepository adoptionRepository;

	public Adoption save(Adoption adoption) {
		return adoptionRepository.save(adoption);
	}

	public Adoption findById(Long id) {
		return adoptionRepository.findById(id);
	}
}
