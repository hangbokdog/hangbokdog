package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.dog.domain.FavoriteDog;

public interface FavoriteDogJpaRepository extends JpaRepository<FavoriteDog, Long> {

	@Modifying(clearAutomatically = true)
	@Transactional
	@Query("DELETE FROM FavoriteDog f WHERE f.dogId = :dogId AND f.memberId = :memberId")
	void deleteFavoriteDogByDogIdAndMemberId(Long dogId, Long memberId);
}
