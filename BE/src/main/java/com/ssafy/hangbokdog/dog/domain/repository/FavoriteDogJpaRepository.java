package com.ssafy.hangbokdog.dog.domain.repository;

import java.util.List;

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

	@Query("""
			SELECT f.dogId 
			FROM FavoriteDog f 
			WHERE f.memberId = :memberId
			""")
	List<Long> getFavoriteDogIdsByMemberId(Long memberId);

}
