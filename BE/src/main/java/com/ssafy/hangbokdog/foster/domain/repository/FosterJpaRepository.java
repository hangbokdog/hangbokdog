package com.ssafy.hangbokdog.foster.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.foster.domain.Foster;

public interface FosterJpaRepository extends JpaRepository<Foster, Long> {
	boolean existsByMemberIdAndDogId(Long memberId, Long dogId);
}
