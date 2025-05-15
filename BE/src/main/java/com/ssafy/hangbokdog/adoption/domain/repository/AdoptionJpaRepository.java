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

	@Query("""
		SELECT COUNT(DISTINCT a.dogId)
		FROM Adoption a
		LEFT JOIN Dog d ON d.id = a.dogId
		WHERE a.status = 'APPLIED' AND d.centerId = :centerId
		""")
	Integer countAdoptionWaitingDogs(Long centerId);

	@Query("""
		SELECT COUNT(DISTINCT a.dogId)
		FROM Adoption a
		LEFT JOIN Dog d ON d.id = a.dogId
		WHERE a.status = 'ACCEPTED' AND d.centerId = :centerId
		""")
	Integer countAdoptedDogs(Long centerId);
}
