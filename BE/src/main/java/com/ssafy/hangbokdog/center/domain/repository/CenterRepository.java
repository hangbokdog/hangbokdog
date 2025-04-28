package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.Center;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CenterRepository {

	private final CenterJpaRepository centerJpaRepository;

	public Center create(Center center) {
		return centerJpaRepository.save(center);
	}
}
