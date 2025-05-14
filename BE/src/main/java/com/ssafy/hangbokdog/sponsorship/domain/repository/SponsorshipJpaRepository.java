package com.ssafy.hangbokdog.sponsorship.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;

public interface SponsorshipJpaRepository extends JpaRepository<Sponsorship, Long>, SponsorshipJpaRepositoryCustom {
	int countByDogId(Long dogId);

	@Query("""
			SELECT s
			FROM Sponsorship s
			WHERE s.dogId = :dogId AND s.memberId = :memberId AND s.status = 'PENDING'
		""")
	boolean existsByMemberIdAndDogId(Long memberId, Long dogId);
}
