package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.dto.CenterSearchInfo;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class CenterRepository {

	private final CenterJpaRepository centerJpaRepository;

	public Center create(Center center) {
		return centerJpaRepository.save(center);
	}

	public Optional<Center> findById(Long centerId) {
		return centerJpaRepository.findById(centerId);
	}

	public boolean existsById(Long id) {
		return centerJpaRepository.existsById(id);
	}

	public String findNameById(Long id) {
		return centerJpaRepository.findNameById(id);
	}

	public List<CenterCity> getExistingCities() {
		return centerJpaRepository.getExistingCities();
	}

	public List<CenterSearchInfo> findCentersByName(String name) {
		return centerJpaRepository.getCentersByName(name);
	}
}
