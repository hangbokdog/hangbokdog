package com.ssafy.hangbokdog.adoption.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.adoption.domain.Adoption;

public interface AdoptionJpaRepository extends JpaRepository<Adoption, Long>, AdoptionJpaRepositoryCustom {

	@Query("""
		SELECT COUNT(a.id) > 0
		FROM Adoption a
		WHERE a.memberId = :memberId AND a.dogId = :dogId AND a.status = 'APPLIED'
		""")
	boolean existsByMemberIdAndDogId(Long memberId, Long dogId);
}
