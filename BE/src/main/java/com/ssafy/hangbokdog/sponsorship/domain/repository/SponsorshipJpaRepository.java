package com.ssafy.hangbokdog.sponsorship.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;

public interface SponsorshipJpaRepository extends JpaRepository<Sponsorship, Long>, SponsorshipJpaRepositoryCustom {

	@Query("""
			SELECT COUNT(s.id) > 0
			FROM Sponsorship s
			WHERE s.dogId = :dogId AND s.memberId = :memberId AND s.status = 'PENDING'
		""")
	Boolean existsByMemberIdAndDogId(Long memberId, Long dogId);
}
